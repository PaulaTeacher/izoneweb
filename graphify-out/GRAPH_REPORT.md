# Graph Report - izone-ecommerce  (2026-09-17)

## Corpus Check
- 119 files · ~606,471 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 994 nodes · 1458 edges · 66 communities (57 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `031d9e3e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- design_system.py
- AuthController
- AdminService
- index.ts
- CatalogService
- CheckoutRequestDto
- devDependencies
- dependencies
- scripts
- compilerOptions
- compilerOptions
- AppService
- tasks
- page.tsx
- page.tsx
- dependencies
- devDependencies
- import-catalog.ts
- cart-context.tsx
- page.tsx
- tsconfig.build.json
- package.json
- index.ts
- IPhoneComparison.tsx
- formatCOP
- Writing apps with Prisma Composer
- oxlint.json
- Product
- nest-cli.json
- seed.ts
- seed-accessories.ts
- package.json
- create-admin.ts
- extends
- FloatingWhatsApp.tsx
- next.config.mjs
- next-env.d.ts
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- Writing apps with Prisma Composer
- app.module.ts
- postcss.config.mjs
- tailwind.config.ts
- 3. Desglose Detallado de Módulos (Benchmark LOB)
- WhatsappController
- PrismaService
- README.md
- auth.module.ts
- layout.tsx
- iZone Tech — E-Commerce Platform
- package.json
- ADR-001: Arquitectura Monorepo con Turborepo + pnpm
- ADR-002: Checkout MVP vía WhatsApp (sin pasarela de pagos)
- auth.controller.ts
- README.md
- embla-carousel-react
- react
- postcss
- @types/node

## God Nodes (most connected - your core abstractions)
1. `scripts` - 21 edges
2. `compilerOptions` - 19 edges
3. `getProducts()` - 18 edges
4. `CatalogService` - 15 edges
5. `compilerOptions` - 15 edges
6. `Product` - 15 edges
7. `formatCOP()` - 15 edges
8. `Writing apps with Prisma Composer` - 15 edges
9. `Writing apps with Prisma Composer` - 15 edges
10. `Writing apps with Prisma Composer` - 15 edges

## Surprising Connections (you probably didn't know these)
- `parseMaterial()` --indirect_call--> `AccessoryMaterial`  [INFERRED]
  apps/api/prisma/import-catalog.ts → packages/shared-types/src/index.ts
- `RecommendedAccessoriesProps` --references--> `Product`  [EXTRACTED]
  apps/web/src/components/product/RecommendedAccessories.tsx → packages/shared-types/src/index.ts
- `main()` --indirect_call--> `Role`  [INFERRED]
  apps/api/prisma/create-admin.ts → packages/shared-types/src/index.ts
- `ProductGridProps` --references--> `Product`  [EXTRACTED]
  apps/web/src/components/home/ProductGrid.tsx → packages/shared-types/src/index.ts
- `ProductGrid()` --calls--> `formatCOP()`  [EXTRACTED]
  apps/web/src/components/home/ProductGrid.tsx → packages/shared-types/src/index.ts

## Import Cycles
- None detected.

## Communities (66 total, 9 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.05
Nodes (61): metadata, inter, metadata, robots(), AccesoriosPage(), metadata, audioConfig, AudioHubPage() (+53 more)

### Community 1 - "design_system.py"
Cohesion: 0.05
Nodes (42): BM25, detect_domain(), _load_csv(), Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, Load CSV and return list of dicts, Core search function using BM25 (+34 more)

### Community 2 - "AuthController"
Cohesion: 0.13
Nodes (13): AuthController, ApiBearerAuth, ApiOperation, ApiTags, Body, Controller, Get, Post (+5 more)

### Community 3 - "AdminService"
Cohesion: 0.09
Nodes (28): AdminController, CATALOG_ROLES, ApiBearerAuth, ApiOperation, ApiTags, Body, Controller, Get (+20 more)

### Community 4 - "index.ts"
Cohesion: 0.05
Nodes (38): AdminUser, ApiError, AuthResponse, Brand, CartItem, CatalogFilters, ComparisonProduct, ComparisonResult (+30 more)

### Community 5 - "CatalogService"
Cohesion: 0.09
Nodes (19): ApiQuery, CatalogController, ApiOperation, ApiTags, Controller, Get, Param, Public (+11 more)

### Community 6 - "CheckoutRequestDto"
Cohesion: 0.18
Nodes (13): CheckoutItemDto, CheckoutRequestDto, CheckoutShippingDto, IsArray, IsInt, IsOptional, IsString, Min (+5 more)

### Community 7 - "devDependencies"
Cohesion: 0.05
Nodes (39): devDependencies, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier, prisma (+31 more)

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, bcrypt, class-transformer, class-validator, helmet, @izone/shared-types, @nestjs/common, @nestjs/core (+29 more)

### Community 9 - "scripts"
Cohesion: 0.07
Nodes (29): author, description, license, name, prisma, seed, private, scripts (+21 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, module (+19 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 12 - "AppService"
Cohesion: 0.29
Nodes (5): AppController, Controller, Get, AppService, Injectable

### Community 13 - "tasks"
Cohesion: 0.09
Nodes (23): ^build, !.next/cache/**, dependsOn, outputs, cache, cache, cache, cache (+15 more)

### Community 14 - "page.tsx"
Cohesion: 0.17
Nodes (12): accessories, AccessoriesCarousel(), categories, CategoryCarousel(), favoriteProducts, FavoritesCarousel(), HeroCarousel(), slides (+4 more)

### Community 15 - "page.tsx"
Cohesion: 0.24
Nodes (14): AdminLoginPage(), AdminProductsPage(), cop, money(), ProductRow, VariantRow, AdminShell(), adminFetch() (+6 more)

### Community 16 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, embla-carousel-autoplay, framer-motion, @izone/shared-types, lucide-react, next, react-dom (+9 more)

### Community 17 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, eslint-config-next, @playwright/test, tailwindcss, @types/react, @types/react-dom (+9 more)

### Community 18 - "import-catalog.ts"
Cohesion: 0.22
Nodes (14): ensureBrand(), ensureCategory(), ensureDeviceModel(), main(), num(), parseCondition(), parseCsv(), parseKind() (+6 more)

### Community 19 - "cart-context.tsx"
Cohesion: 0.20
Nodes (11): categories, CategoryGroup, CategoryItem, Header(), Navbar(), CompareModel, COMPARISON_MODELS, IPhoneComparison() (+3 more)

### Community 20 - "page.tsx"
Cohesion: 0.18
Nodes (7): platforms, SocialFollow(), stats, easeOut, FadeIn(), RecommendedAccessories(), RecommendedAccessoriesProps

### Community 21 - "tsconfig.build.json"
Cohesion: 0.17
Nodes (11): compilerOptions, rootDir, exclude, extends, include, dist, node_modules, **/*spec.ts (+3 more)

### Community 22 - "package.json"
Cohesion: 0.18
Nodes (10): devDependencies, turbo, turbo, name, packageManager, private, scripts, build (+2 more)

### Community 23 - "index.ts"
Cohesion: 0.20
Nodes (5): Public(), JwtAuthGuard, Injectable, RolesGuard, Injectable

### Community 24 - "IPhoneComparison.tsx"
Cohesion: 0.07
Nodes (29): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Example Workflow, How to Use This Skill, Icons & Visual Elements, Interaction (+21 more)

### Community 25 - "formatCOP"
Cohesion: 0.36
Nodes (8): CartDrawer(), StickyBuyBar(), StickyBuyBarProps, VariantSelector(), checkoutWhatsapp(), validateCoupon(), formatCOP(), variantLabel()

### Community 26 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 27 - "oxlint.json"
Cohesion: 0.29
Nodes (6): env, node, rules, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, $schema

### Community 28 - "Product"
Cohesion: 0.24
Nodes (9): ProductGrid(), ProductGridProps, ProductSpecsAccordion(), ProductSpecsAccordionProps, VariantSelectorProps, CategoryHubProps, CartContextType, Product (+1 more)

### Community 29 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 30 - "seed.ts"
Cohesion: 0.40
Nodes (5): FamilySeed, main(), prisma, SubcategorySeed, TAXONOMY

### Community 31 - "seed-accessories.ts"
Cohesion: 0.60
Nodes (4): main(), prisma, upsertBrand(), upsertCategory()

### Community 32 - "package.json"
Cohesion: 0.40
Nodes (4): main, name, types, version

### Community 33 - "create-admin.ts"
Cohesion: 0.50
Nodes (3): main(), prisma, Role

### Community 34 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 38 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 39 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 40 - "Writing apps with Prisma Composer"
Cohesion: 0.10
Nodes (19): Anatomy of a service, Builds are yours, Databases, Deploy config, Deploying, Driving deploys from code, Object Storage, Production pitfalls (+11 more)

### Community 41 - "app.module.ts"
Cohesion: 0.19
Nodes (10): AdminModule, Module, AppModule, Module, bootstrap(), PrismaModule, Module, Module (+2 more)

### Community 50 - "3. Desglose Detallado de Módulos (Benchmark LOB)"
Cohesion: 0.14
Nodes (13): 1. Mapa Global de Arquitectura del Sitio, 2. Design Tokens y Sistema Visual de iShop, 3. Desglose Detallado de Módulos (Benchmark LOB), 4. Desglose de Ficha de Producto (Benchmark PDP), 5. Implementación Aplicada en iZone Tech, A. Módulos de Categoría (LOB Hubs):, B. Módulos de Ficha de Producto (PDP):, Benchmark de Arquitectura y Módulos de iShop Colombia (+5 more)

### Community 51 - "WhatsappController"
Cohesion: 0.17
Nodes (9): ApiOperation, ApiTags, Body, Controller, Get, Post, Public, Query (+1 more)

### Community 52 - "PrismaService"
Cohesion: 0.29
Nodes (4): PrismaService, Injectable, Injectable, WhatsappService

### Community 53 - "README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 54 - "auth.module.ts"
Cohesion: 0.27
Nodes (6): AuthModule, Module, getJwtSecret(), JwtPayload, JwtStrategy, Injectable

### Community 55 - "layout.tsx"
Cohesion: 0.20
Nodes (6): CartDrawer, FloatingWhatsApp, announcements, TopAnnouncementBar(), CartProvider(), SOCIAL_LINKS

### Community 56 - "iZone Tech — E-Commerce Platform"
Cohesion: 0.18
Nodes (10): API Docs, Arquitectura, Comandos Principales, Estructura de Directorios, Instalación y Setup, Integración con Conectik ERP (Future-Proof), iZone Tech — E-Commerce Platform, Licencia (+2 more)

### Community 57 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, start, test:e2e (+1 more)

### Community 58 - "ADR-001: Arquitectura Monorepo con Turborepo + pnpm"
Cohesion: 0.22
Nodes (8): ADR-001: Arquitectura Monorepo con Turborepo + pnpm, Consecuencias, Contexto, Decisión, Estado, Fecha, Justificación, Opciones Consideradas

### Community 59 - "ADR-002: Checkout MVP vía WhatsApp (sin pasarela de pagos)"
Cohesion: 0.22
Nodes (8): ADR-002: Checkout MVP vía WhatsApp (sin pasarela de pagos), Consecuencias, Contexto, Decisión, Estado, Fecha, Justificación, Opciones Consideradas

### Community 60 - "auth.controller.ts"
Cohesion: 0.48
Nodes (5): LoginDto, RefreshTokenDto, IsString, MinLength, IsEmail

### Community 61 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **401 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+396 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CatalogService` connect `CatalogService` to `index.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `DeviceKind` connect `CatalogService` to `index.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `AccessoryMaterial` connect `CatalogService` to `import-catalog.ts`, `index.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `BM25 ranking algorithm for text search`, `Lowercase, split, remove punctuation, filter short words`, `Build BM25 index from documents` to the rest of the system?**
  _428 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0545308740978348 - nodes in this community are weakly interconnected._
- **Should `design_system.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `AuthController` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._