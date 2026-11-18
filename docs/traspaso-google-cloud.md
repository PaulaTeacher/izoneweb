# Traspaso: configurar Google Cloud (Fases 4 y 5)

> Para continuar en otro asistente (p. ej. Antigravity). Fecha: 2026-11-18. Idioma: **español**.
> Plan completo: [`plan-despliegue-google.md`](plan-despliegue-google.md).

## 1. Estado de los PRs (repo `PaulaTeacher/izoneweb`)

| PR | Fase | Rama | Estado |
|---|---|---|---|
| #8 | Links sin mocks en 404 | `fix/product-links-no-mock-404` | abierto |
| #9 | 1 — Web resistente al arranque en frío | `fix/web-cold-start-resilience` (apilado sobre #8) | CI verde |
| #10 | 2 — `POST /cron/release-expired` con `X-Cron-Secret` | `feat/api-cron-endpoint` | CI verde |
| #11 | 3 — `Dockerfile`, `/health`, arranque en 0,8 s | `feat/api-docker` | CI verde (incluye `docker build` real) |
| #12 | 6 — Cargador de stock/SKUs (`db:load-stock`) | `feat/stock-sku-loader` | abierto |

**Antes de desplegar, fusionar en `main`: #10 y #11** (la API). Para la web (Fase 5): #8 y luego #9.
La usuaria decide los merges.

## 2. Reglas

- Los comandos con secretos los ejecuta la usuaria. Nunca pegar secretos en el chat ni en el repo.
- No ejecutar `prisma db seed` ni `sync-izone-catalog.ts` contra la BD real.
- Facturación, presupuesto y dominio los configura la usuaria desde la consola.
- Verificar precios/cuotas actuales en la documentación oficial (Cloud Run, Scheduler, Secret Manager, App Hosting).

## 3. Fase 4 — API en Cloud Run

Datos: Supabase proyecto `cakbtslrcfbyyhqtqiee`. Elegir la región de Cloud Run más cercana a la de Supabase
(ver la región en el host del pooler, `aws-0-<región>.pooler.supabase.com`).

1. Proyecto de Google Cloud + facturación (plan Blaze) + **alerta de presupuesto ~5 USD** (consola).
2. Activar APIs:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com cloudscheduler.googleapis.com
   ```
3. Secretos en Secret Manager (los crea la usuaria; valores nunca en el chat):
   - `DATABASE_URL` — pooler 6543 **con `?pgbouncer=true&connection_limit=1`** (el `.env` local hoy NO trae `connection_limit=1`).
   - `DIRECT_URL`, `JWT_SECRET` (`openssl rand -hex 32`), `CRON_SECRET` (`openssl rand -hex 32`).
   ```bash
   printf '%s' "<valor>" | gcloud secrets create DATABASE_URL --data-file=-
   ```
   Dar acceso `roles/secretmanager.secretAccessor` a la cuenta de servicio de Cloud Run.
4. Desplegar desde la raíz del repo (Cloud Build usa el `Dockerfile`; no hace falta Docker local):
   ```bash
   gcloud run deploy izone-api --source . --region <región> \
     --min-instances 0 --max-instances 2 --memory 512Mi --cpu 1 --cpu-throttling \
     --allow-unauthenticated \
     --set-secrets DATABASE_URL=DATABASE_URL:latest,DIRECT_URL=DIRECT_URL:latest,JWT_SECRET=JWT_SECRET:latest,CRON_SECRET=CRON_SECRET:latest \
     --set-env-vars NODE_ENV=production,ENABLE_INTERNAL_CRON=false,NEXT_PUBLIC_SITE_URL=https://<dominio-web>,NEXT_PUBLIC_WHATSAPP_NUMBER=<número-real>
   ```
5. Cloud Scheduler cada 15 min:
   ```bash
   gcloud scheduler jobs create http izone-release-reservations --location <región> \
     --schedule "*/15 * * * *" --http-method POST \
     --uri "https://<url-api>/cron/release-expired" \
     --headers "X-Cron-Secret=<CRON_SECRET>"
   ```
6. Verificar: `GET /health` → `{"status":"ok"}`; `GET /catalog/products` → 200; `POST /cron/release-expired`
   sin cabecera → 401, con cabecera → 200; `/api/docs` carga; CORS desde el dominio de la web; tiempos en logs
   (`Nest application successfully started`, `Database connected in`).

Detalles de la imagen y tiempos: `docs/despliegue-api.md` (en el PR #11).

## 4. Fase 5 — Web (Firebase App Hosting o Cloud Run)

- `apphosting.yaml` para monorepo pnpm, raíz de la app `apps/web`.
- Variables: `NEXT_PUBLIC_API_URL=<url-api>`, `NEXT_PUBLIC_SITE_URL=https://<dominio>`, `NEXT_PUBLIC_WHATSAPP_NUMBER=<número-real>` (+ GA/GTM/Pixel si aplica).
- **`next build` falla si la API no responde** (a propósito, PR #9): desplegar la API primero.
- Revisar `next.config.mjs` (imágenes), `/api/revalidate`, sitemap/robots con el dominio real.
- Alternativa si App Hosting falla con el monorepo: contenedor de la web en Cloud Run.
- Dominio y SSL: la usuaria desde la consola. Probar home, categorías, ficha, carrito y checkout por WhatsApp desde un celular.

## 5. Datos pendientes de la usuaria (Fase 6)

Stock real por SKU, SKUs reales de los 6 inventados (`AP5-NOMAG`, `AWSE3-40-STARLIGHT`, `MBN13-A18P-256/512-BLUSH`,
`MK-IPADAIR11-BLK`, `MK-IPADPRO11`), precios del iPhone Duo, "más vendidos" y **número real de WhatsApp**.
Cargar con `pnpm --filter api db:load-stock` (dry-run por defecto; `--apply` para escribir).
