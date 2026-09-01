# iZone Tech — E-Commerce Platform

Plataforma e-commerce full-stack para **iZone Tech**, especializada en productos del ecosistema Apple y accesorios premium. Mercado: Bogotá, Colombia.

## Arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14+ (App Router) + TypeScript |
| Estilos | Tailwind CSS 3 + shadcn/ui |
| Animaciones | Framer Motion |
| Backend | NestJS + TypeScript |
| ORM / DB | PostgreSQL + Prisma |
| Monorepo | pnpm workspaces + Turborepo |

### Estructura de Directorios

```
izone-ecommerce/
├── apps/
│   ├── web/              # Frontend — Next.js 14+ (App Router)
│   │   └── src/
│   │       ├── app/      # Rutas (App Router)
│   │       ├── components/ # Componentes React
│   │       └── lib/      # Utilidades, API client
│   └── api/              # Backend — NestJS
│       ├── src/
│       │   ├── catalog/  # Módulo de catálogo
│       │   ├── whatsapp/ # Módulo de checkout WhatsApp
│       │   ├── prisma/   # Servicio Prisma
│       │   └── ...
│       └── prisma/       # Schema + migraciones + seed
├── packages/
│   └── shared-types/     # Tipos TypeScript compartidos FE/BE
├── turbo.json            # Configuración Turborepo
└── pnpm-workspace.yaml   # Configuración workspaces
```

## Requisitos Previos

- **Node.js** >= 18
- **pnpm** >= 8
- **Docker** (para PostgreSQL local) o PostgreSQL instalado
- **Git**

## Instalación y Setup

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd izone-ecommerce

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example apps/api/.env

# 4. Iniciar PostgreSQL (Docker)
cd apps/api && docker compose up -d

# 5. Crear tablas en la base de datos
pnpm --filter api db:push

# 6. Poblar con datos de ejemplo
pnpm --filter api db:seed

# 7. Iniciar el desarrollo
pnpm dev
```

El frontend estará en **http://localhost:3000** y el backend en **http://localhost:3001**.

## Comandos Principales

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia frontend + backend en paralelo |
| `pnpm build` | Compila ambos proyectos |
| `pnpm lint` | Ejecuta linters |
| `pnpm --filter api test` | Tests del backend |
| `pnpm --filter api db:push` | Aplica schema Prisma a la DB |
| `pnpm --filter api db:seed` | Pobla la DB con datos de ejemplo |
| `pnpm --filter api db:generate` | Regenera el cliente Prisma |

## Variables de Entorno

Copia `.env.example` a `apps/api/.env` y configura:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://user:password@localhost:5432/izone_db` |
| `PORT` | Puerto del backend | `3001` |
| `JWT_SECRET` | Secret para tokens JWT | (generar con `openssl rand -hex 32`) |
| `NEXT_PUBLIC_API_URL` | URL del backend para el frontend | `http://localhost:3001` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número WhatsApp Business | `573001234567` |

## API Docs

Una vez corriendo el backend, accede a la documentación Swagger en:

**http://localhost:3001/api/docs**

## Integración con Conectik ERP (Future-Proof)

El backend incluye campos de sincronización (`erp_product_id`, `erp_transaction_id`, `sync_status`) preparados para integración futura con Conectik ERP.

## Licencia

Privado — iZone Tech © 2026
