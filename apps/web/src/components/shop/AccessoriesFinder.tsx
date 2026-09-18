import type { ReactNode } from 'react';
import Link from 'next/link';
import type { DeviceModel } from '@izone/shared-types';
import {
  ACCESSORY_TYPES,
  MATERIAL_CHIPS,
  accessoriesHref,
  patchAccesoriosQuery,
  type AccesoriosQuery,
} from '@/lib/accessories';

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-[#1D1D1F] text-white'
          : 'bg-white text-[#1D1D1F] border border-black/10 hover:bg-black/5'
      }`}
    >
      {children}
    </Link>
  );
}

export function AccessoriesFinder({
  query,
  deviceModels,
}: {
  query: AccesoriosQuery;
  deviceModels: DeviceModel[];
}) {
  const brands = Array.from(
    new Map(deviceModels.map((m) => [m.brand.slug, m.brand.name])).entries(),
  );

  const models = deviceModels.filter((m) => {
    if (query.brand && m.brand.slug !== query.brand) return false;
    if (query.kind && m.kind !== query.kind) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          1. Qué buscas
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCESSORY_TYPES.map((t) => (
            <Chip
              key={t.slug || 'all'}
              href={accessoriesHref(patchAccesoriosQuery(query, { tipo: t.slug }))}
              active={(query.tipo || '') === t.slug}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          2. Marca de tu dispositivo
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            href={accessoriesHref(patchAccesoriosQuery(query, { brand: undefined, modelo: undefined }))}
            active={!query.brand}
          >
            Todas
          </Chip>
          {brands.map(([slug, name]) => (
            <Chip
              key={slug}
              href={accessoriesHref(patchAccesoriosQuery(query, { brand: slug }))}
              active={query.brand === slug}
            >
              {name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          3. Modelo
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            href={accessoriesHref({ ...query, modelo: undefined })}
            active={!query.modelo}
          >
            Todos
          </Chip>
          {models.map((m) => (
            <Chip
              key={m.slug}
              href={accessoriesHref({ ...query, modelo: m.slug, brand: m.brand.slug })}
              active={query.modelo === m.slug}
            >
              {m.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          Material
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            href={accessoriesHref({ ...query, material: undefined })}
            active={!query.material}
          >
            Todos
          </Chip>
          {MATERIAL_CHIPS.map((m) => (
            <Chip
              key={m.slug}
              href={accessoriesHref({ ...query, material: m.slug })}
              active={query.material === m.slug}
            >
              {m.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
