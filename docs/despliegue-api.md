# API en contenedor (Cloud Run)

Imagen definida en el [`Dockerfile`](../Dockerfile) de la raíz (contexto = raíz del monorepo).

## Construir

```bash
# Opción A — sin Docker local: Cloud Build construye con este Dockerfile (Fase 4)
gcloud run deploy izone-api --source . --region <región>

# Opción B — Docker local. En Mac con Apple Silicon hay que forzar amd64 para Cloud Run.
docker build --platform linux/amd64 -t izone-api .
docker run --rm -p 8080:8080 --env-file apps/api/.env -e PORT=8080 izone-api
```

Etapas: `base` (Node 22 bookworm-slim + OpenSSL + pnpm por corepack) → `build`
(`pnpm install --frozen-lockfile --filter api...`, `prisma generate`, `nest build`,
`pnpm deploy --prod`) → `runtime` (solo `dist`, `node_modules` de prod y `package.json`, usuario `node`).
`@izone/shared-types` no se compila: la API no lo importa y el paquete es solo TS.

## Variables en tiempo de ejecución

Ver [`apps/api/.env.example`](../apps/api/.env.example). La imagen fija `NODE_ENV=production`,
`PORT=8080` (Cloud Run lo sobrescribe) y `ENABLE_INTERNAL_CRON=false`.

- `DATABASE_URL` — pooler de Supabase en modo transacción (puerto 6543) **con**
  `?pgbouncer=true&connection_limit=1`. Sin `connection_limit=1` cada instancia abre
  varias conexiones y agota el pooler del plan gratis.
- `DIRECT_URL` — solo para migraciones; la API en ejecución no la usa.
- `CATALOG_WARMUP=false` — opcional, desactiva el precalentado de caché.

## Arranque (medido el 2026-11-18, Mac M-series, BD Supabase real)

| | Antes | Ahora |
|---|---|---|
| Hasta que el puerto escucha / `GET /health` responde | 5,8 s | **0,6–0,8 s** |
| Conexión Prisma (`$connect`) | ~1,7 s **bloqueando** `listen` | ~1,2 s en segundo plano |
| Precalentado de caché (11 consultas) | 3,1 s **bloqueando** `listen` | ~3 s en segundo plano |

Ni la conexión a la BD ni el precalentado bloquean ya el arranque. Una petición de catálogo
que llega mientras se precalienta tarda ~1–2 s; después sale de la caché en memoria (~4 ms).
Si la BD no está disponible al arrancar, `/health` sigue respondiendo, el error queda en el log
(`Database connection failed`) y el catálogo responde 500 (la web lo trata como "API no
disponible", Fase 1). Prisma reintenta la conexión en la siguiente consulta.
En Cloud Run se espera algo más (CPU más lenta que un Mac); volver a medir tras la Fase 4
con los logs (`Nest application successfully started`, `Database connected in`).

## Endpoints operativos

- `GET /health` — liveness, sin BD, sin auth ni throttling, fuera de Swagger.
- `POST /cron/release-expired` — ver PR de la Fase 2 (cabecera `X-Cron-Secret`).

## Apagado

`enableShutdownHooks()`: ante el SIGTERM de Cloud Run, Nest cierra los módulos (Prisma se desconecta) y el proceso sale limpio.
