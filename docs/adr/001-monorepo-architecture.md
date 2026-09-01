# ADR-001: Arquitectura Monorepo con Turborepo + pnpm

## Estado
Aceptado

## Fecha
2026-09-01

## Contexto
iZone Tech necesita una plataforma e-commerce con frontend (Next.js) y backend (NestJS) que compartan tipos TypeScript. Se evaluaron tres opciones de organización de código.

## Opciones Consideradas
1. **Repositorios separados** — frontend y backend en repos distintos.
2. **Monorepo con npm workspaces** — sin herramienta de build.
3. **Monorepo con pnpm workspaces + Turborepo** — build cacheados y tipos compartidos.

## Decisión
Se eligió la **Opción 3**: monorepo con pnpm workspaces + Turborepo.

## Justificación
- **Tipos compartidos:** El paquete `@izone/shared-types` permite que frontend y backend compartan interfaces, DTOs y enums sin duplicación.
- **pnpm** ofrece instalación más rápida y eficiente en espacio que npm.
- **Turborepo** cachea builds y ejecuta tasks en paralelo (`pnpm dev` inicia ambos servicios).
- Un solo repo simplifica CI/CD, code reviews y refactorizaciones cross-stack.

## Consecuencias
- **Positivas:** Un solo `pnpm install`, tipos sincronizados, depliegue coordinado.
- **Negativas:** Mayor complejidad inicial de setup. Los equipos de FE y BE ven código del otro.
