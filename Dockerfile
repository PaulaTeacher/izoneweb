# syntax=docker/dockerfile:1.7
# ==========================================================================
# iZone Tech API (apps/api) — imagen para Cloud Run.
# Contexto de build: raíz del monorepo.
#   docker build --platform linux/amd64 -t izone-api .
#   gcloud run deploy ... --source .     (Cloud Build usa este Dockerfile)
# La imagen NO contiene secretos: DATABASE_URL, JWT_SECRET, CRON_SECRET, etc.
# se inyectan en tiempo de ejecución (Secret Manager / variables de Cloud Run).
# ==========================================================================

ARG NODE_VERSION=22

# ---------- base: Node + pnpm (versión de "packageManager") + OpenSSL para Prisma
FROM node:${NODE_VERSION}-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /repo

# ---------- build: instala con lockfile, genera Prisma, compila y aísla deps de prod
FROM base AS build
# Primero solo manifiestos (mejor caché de capas). Se copian todos los package.json
# del workspace para que --frozen-lockfile coincida con el lockfile.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared-types/package.json packages/shared-types/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter "api..."

COPY packages/shared-types packages/shared-types
COPY apps/api apps/api

RUN pnpm --filter api exec prisma generate \
 && pnpm --filter api build

# node_modules solo de producción, autocontenido, en /out.
# El postinstall de la API ("prisma generate || exit 0") no encuentra el CLI de
# Prisma en prod, así que se genera el cliente aquí con el CLI del paso anterior.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm --filter api deploy --prod /out \
 && cd /out \
 && /repo/apps/api/node_modules/.bin/prisma generate --schema prisma/schema.prisma

# ---------- runtime: solo dist + node_modules de producción, usuario sin privilegios
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    PORT=8080 \
    ENABLE_INTERNAL_CRON=false
WORKDIR /app
COPY --from=build --chown=node:node /out/package.json ./package.json
COPY --from=build --chown=node:node /out/node_modules ./node_modules
COPY --from=build --chown=node:node /out/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "dist/main.js"]
