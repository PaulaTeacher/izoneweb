# Plan de implementación: despliegue de iZone Tech en Google Cloud (costo casi cero)

> Documento de traspaso para iniciar una conversación nueva con Opus 5.5.
> Fecha: 2026-11-18. Idioma de trabajo con la usuaria: **español**.

## 0. Prompt sugerido para pegar al iniciar la conversación

```text
Lee docs/plan-despliegue-google.md completo y ejecútalo por fases, en orden.
Trabaja en una rama nueva por fase desde main, con PR por fase. No hagas
merge, push a main ni cambios de configuración de cuentas (GitHub, Google
Cloud, Supabase): esos los decido yo. Antes de cada fase dime en 3 líneas qué
vas a hacer. Empieza por la Fase 1.
```

## 1. Contexto del proyecto

- Monorepo `izone-ecommerce` (pnpm 9, `packageManager: pnpm@9.0.0`, turbo).
  Repo GitHub: `PaulaTeacher/izoneweb`. Ruta local: `/Users/kinma/Documents/Web Dev/izone-ecommerce`.
- `apps/api`: NestJS + Prisma 5.22. `apps/web`: Next.js 14.2.35 (App Router). `packages/shared-types`.
- Base de datos: Supabase Postgres, proyecto `izoneweb`, ref `cakbtslrcfbyyhqtqiee`.
  Solo se usa como Postgres vía Prisma (`DATABASE_URL` pooler 6543 + `DIRECT_URL`). No se usa Supabase Auth ni Storage.
- Tienda de Apple en Colombia (Bogotá, CC Unilago). El pedido se cierra por **WhatsApp** (no hay pasarela de pago).
  El checkout reserva stock 30 min (`reservedUntil`) y un cron libera reservas vencidas.
- CI en GitHub Actions: lint + tests + build (api) y lint + `tsc` (web). Node 22.

## 2. Decisión tomada y restricciones

**Presupuesto: casi cero.** La usuaria no puede asumir ~50 USD/mes (Vercel Pro + Render + Supabase Pro).
La propuesta comercial al cliente no los contempla. Ruta elegida: **Google Cloud**.

| Pieza | Destino | Costo esperado |
|---|---|---|
| Web `apps/web` | Firebase App Hosting (o Cloud Run), plan Blaze con alerta de presupuesto | ~0–3 USD |
| API `apps/api` | Cloud Run, escalado a cero | ~0–1 USD |
| Cron de reservas | Cloud Scheduler → endpoint protegido | 0 |
| Base de datos | **Se queda en Supabase plan gratis** (no migrar a Neon) | 0 |

Por qué Supabase y no Neon: el cron toca la BD, así que Supabase no se pausa por inactividad;
Neon gratis tiene tope de horas de cómputo (~100 CU-h/mes, verificar) que un cron cada 5 min agotaría;
y migrar a Neon añade trabajo sin ganancia clara. Revisar la decisión solo si la cuota de Supabase se queda corta.

**Vercel NO se usa**: su plan gratis (Hobby) no permite uso comercial.

**Verificar cuotas y precios actuales en la documentación oficial antes de comprometerlos con el cliente**
(Cloud Run free tier, Cloud Scheduler, App Hosting, Supabase free). Lo escrito aquí viene de memoria y puede haber cambiado.

## 3. Reglas de trabajo (importantes)

- Una rama por fase desde `main`, un PR por fase. **La usuaria decide los merges y los push a `main`.**
- Comandos con contraseñas/secretos los ejecuta la usuaria; nunca pegar secretos en el chat ni en el repo.
- Nunca ejecutar `prisma db seed` ni `sync-izone-catalog.ts` contra la BD real sin pedir confirmación:
  el seed borra todas las tablas (`deleteMany`) y el sync pisa precios/nombres y desactiva productos
  (ya exige `--force`; ya NO reinicia el stock).
- Configuración de cuentas (GitHub branch protection, facturación de Google Cloud, plan de Supabase) = tarea de la usuaria; solo guiarla.
- Hay otra línea de trabajo con cambios sin commitear en la rama `fix/seo-prelaunch-bugs`
  (`apps/api/src/admin/*`, `catalog.*`, y un `whatsapp-number.ts` nuevo). **No tocarla ni pisarla**;
  consultar a la usuaria antes de basarse en ella. También existe la rama remota `admin` con trabajo pendiente de integrar.
- Mantener lint, `tsc` y tests en verde en cada PR.

## 4. Estado actual del repo (2026-11-18)

- `main` ya incluye: catálogo de 33 SKUs, hero con imágenes de Figma, bento grid, retoma (`/trade-in`),
  cross-sell en carrito, CI, tests de checkout/cron. PRs #3–#7 fusionados.
- **PR #8 abierto** (`fix/product-links-no-mock-404`): `getProduct` ya no inventa productos con mocks cuando la API responde 404;
  el carrito sugiere accesorios compatibles; textos del footer actualizados. Pendiente de CI y merge.
- BD limpia: se eliminaron 3 variantes viejas del iPhone 17 Pro y el pedido de prueba. Hoy hay 0 pedidos.
- Catálogo verificado contra el CSV `Productos catalogo iZone - Hoja 1.csv`: los 30 precios coinciden.

## 5. Variables de entorno (nombres detectados en el código)

API: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`,
`NEXT_PUBLIC_SITE_URL` (la usa `main.ts` para CORS), `NEXT_PUBLIC_WHATSAPP_NUMBER`, `PORT`.
Web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
`NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`,
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
No existe `apps/api/.env.example`: crearlo (sin valores reales). Ojo: el `.env.example` de la raíz trae
`NEXT_PUBLIC_WHATSAPP_NUMBER="573001234567"`, que es un **número de ejemplo**; los pedidos deben ir al número real.

## 6. Fases

### Fase 1 — Robustez de arranque en frío (web) — BLOQUEANTE
Problema: `apps/web/src/lib/api.ts` usa `CATALOG_FETCH_TIMEOUT_MS = 4000`. Con Cloud Run escalado a cero, la primera petición
puede tardar 2–4 s o más; si se supera, la web puede renderizar catálogo vacío o 404 y **cachearlo** (ISR).
Además, con el cambio del PR #8 en producción un timeout devuelve `null` y la página hace `notFound()`.
Hacer:
- Subir el timeout (p. ej. 10–15 s) y reintentar una vez.
- Distinguir "la API respondió 404" (→ `notFound`) de "no pude contactar la API" (→ lanzar error para que Next NO cachee ni muestre 404/catálogo vacío).
- Revisar `revalidate`/tags y `generateStaticParams` para que un fallo de build/arranque no congele páginas vacías.
- Tests (vitest) para ambos casos. Verificar en local apagando la API.
Aceptación: con la API caída las páginas dinámicas muestran error/reintento, nunca "producto no existe" ni catálogo vacío cacheado.

### Fase 2 — Cron por endpoint protegido (API)
Hoy `apps/api/src/cron/order-cron.service.ts` usa `@Cron(EVERY_5_MINUTES)` dentro del proceso; si Cloud Run está a cero no corre.
Hacer:
- Extraer la lógica de liberación a un método reutilizable.
- Endpoint `POST /cron/release-expired` protegido con un token (`CRON_SECRET`, comparación en tiempo constante), excluido del throttling y de Swagger público.
- Mantener o desactivar el `@Cron` interno detrás de una variable (`ENABLE_INTERNAL_CRON`), para dev local.
- Cloud Scheduler lo llamará cada **15 min** (la reserva dura 30 min; 15 basta y reduce llamadas).
- Actualizar `order-cron.service.spec.ts` y añadir tests del endpoint (sin token → 401/403; con token → libera).
Aceptación: tests verdes; llamada manual con token libera una reserva vencida (se puede forzar `reservedUntil` en el pasado).

### Fase 3 — Dockerfile y arranque de la API
- `Dockerfile` en la raíz (multi-stage) para el monorepo: instalar con pnpm 9 y lockfile, compilar `packages/shared-types` y `apps/api`,
  `prisma generate`, imagen final pequeña, `node dist/main`, escucha en `$PORT` (Cloud Run lo inyecta) y `0.0.0.0`.
- `.dockerignore`. Healthcheck simple (`GET /health` o similar; crearlo si no existe).
- Verificar el pooler de Supabase: con PgBouncer en modo transacción Prisma necesita `?pgbouncer=true&connection_limit=1` en `DATABASE_URL`; `DIRECT_URL` solo para migraciones.
- Revisar `dns.setDefaultResultOrder('ipv4first')` (ya en `main.ts`) y el precalentado de caché de arranque (~2 s contra Supabase) para que no bloquee el health de Cloud Run.
- Probar local: `docker build` y `docker run` contra la BD real en modo lectura (no ejecutar seeds).
Aceptación: imagen arranca, `/catalog/products` responde, tiempo de arranque medido y documentado.

### Fase 4 — Despliegue de la API en Cloud Run (guiado, lo ejecuta la usuaria)
- Pasos: proyecto de Google Cloud + plan Blaze, **alerta de presupuesto (~5 USD)**, Artifact Registry, `gcloud run deploy`
  (región cercana a Supabase; `min-instances=0`, `max-instances` bajo, CPU solo durante peticiones, memoria 512 MiB para empezar),
  secretos en Secret Manager (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CRON_SECRET`) y variables normales para el resto.
- Cloud Scheduler: job HTTP cada 15 min con el token. Segundo job opcional de "keep-alive" no necesario (el cron ya toca la BD).
- Verificar Swagger/endpoints, CORS con el dominio de la web y un checkout de prueba end-to-end.
- Pedir a la usuaria que ejecute los comandos con secretos; el asistente solo prepara los comandos y valida resultados.

### Fase 5 — Despliegue de la web (Firebase App Hosting o Cloud Run)
- `apphosting.yaml` para monorepo pnpm (directorio raíz de la app `apps/web`), variables públicas (`NEXT_PUBLIC_API_URL` = URL de Cloud Run o `api.<dominio>`),
  y revisar que `@izone/shared-types` se compile en el build.
- Verificar `next.config` (imágenes locales desde `/public`, `remotePatterns`), `/api/revalidate` y sitemap/robots con el dominio real.
- Si App Hosting da problemas con el monorepo, alternativa: contenedor de la web en Cloud Run.
- Dominio propio y SSL (lo conecta la usuaria desde la consola).
Aceptación: home, categorías, ficha de producto, carrito y checkout funcionan contra la API desplegada, desde un celular real.

### Fase 6 — Datos de producción y limpieza (puede ir en paralelo a la 1–3)
Pedir a la usuaria:
1. **Stock real por SKU** (el CSV solo trae unidades vendidas, no inventario; los stocks actuales de la BD son de relleno).
2. **SKUs reales** de los 6 productos sin SKU en el CSV (MacBook Neo 256/512, Apple Watch SE 3 40mm, AirPods 5, Magic Keyboard iPad Pro 11" y Air 11"): hoy tienen SKUs internos inventados.
3. Confirmar el **iPhone Duo** (3 variantes, no está en el CSV): precios y stock reales.
4. Si se usa la columna "Unidades Vendidas" para ordenar "más vendidos" en el Home.
5. **Número real de WhatsApp** (web y API) y revisar quién atiende y cómo se revisan los pedidos `reserved`.
Hacer: script de carga de stock/SKUs idempotente y con `--dry-run` por defecto; nunca borrar datos sin confirmar.

### Fase 7 — Pendientes de producto antes de abrir al público
- **Fotos finales de productos** (la usuaria las exporta desde Figma a 2x/3x, PNG con transparencia).
  Hoy hay placeholders: varios productos comparten el mismo archivo (mismo md5) y el iPhone 18 Pro Max "Burgundy" se ve naranja.
  Revisar también la resolución de los heroes de iPhone Duo y MacBook Air (el de iPhone 18 Pro ya se reemplazó a 1100×1700).
- **Páginas legales** (Colombia): política de tratamiento de datos (Ley 1581), términos y condiciones, garantía y cambios,
  y aviso de cookies si se cargan GA/GTM/Meta Pixel. Redactar borradores para revisión legal; hoy el footer enlaza a `/#garantia`.
- `/ipad` muestra solo el Magic Keyboard de Pro 11" (falta el de Air).
- Prueba del flujo completo en celular real, incluido el botón de WhatsApp.
- Tests de web/admin (no existen) y monitoreo de errores (p. ej. Sentry o Cloud Error Reporting).
- Integrar la rama `admin` y el trabajo de `fix/seo-prelaunch-bugs` cuando la usuaria lo decida.

### Fase 8 — Operación (tareas de la usuaria, solo guiar)
- Protección de `main` en GitHub (exigir el CI).
- Respaldo semanal de la BD (p. ej. GitHub Actions con `pg_dump` a almacenamiento gratis) mientras Supabase esté en plan gratis;
  pasar a Supabase Pro (~25 USD) cuando haya ventas reales por las copias automáticas.
- Contraseña del admin (`izonetech.co@gmail.com`, SUPERADMIN) ya rotada; confirmar correo de recuperación.
- RLS: las 6 tablas con RLS activo y sin políticas bloquean el acceso directo vía API de Supabase, lo cual es correcto mientras todo pase por NestJS/Prisma. Solo definir políticas si el frontend llegara a leer Supabase directo.

## 7. Orden recomendado y estimación de costo

1 → 2 → 3 → (6 en paralelo) → 4 → 5 → 7 → 8. Despliegue a producción **solo** cuando 6 y 7 estén listos; antes, entorno de prueba.
Costo mensual esperado: 0–5 USD al inicio (más dominio ~10–20 USD/año). Primer gasto que conviene asumir con ventas: Supabase Pro.

## 8. Cosas a no hacer

- No usar Vercel Hobby para la tienda; no migrar a Neon sin necesidad; no usar Firestore (obligaría a reescribir toda la API).
- No dejar el número de WhatsApp de ejemplo, ni stock/precios de relleno, ni mocks activos en producción.
- No publicar secretos en el repo, en PRs ni en el chat.
