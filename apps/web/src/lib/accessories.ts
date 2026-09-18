export type AccesoriosQuery = {
  tipo?: string;
  brand?: string;
  modelo?: string;
  material?: string;
  kind?: string;
  marca?: string;
};

export const ACCESSORY_TYPES: { slug: string; label: string; kind?: string }[] = [
  { slug: '', label: 'Todos' },
  { slug: 'fundas', label: 'Fundas' },
  { slug: 'energia', label: 'Energía' },
  { slug: 'accesorios-mac', label: 'Mac', kind: 'laptop' },
  { slug: 'cables-hubs', label: 'Cables y hubs' },
  { slug: 'magsafe', label: 'MagSafe' },
];

export const MATERIAL_CHIPS: { slug: string; label: string }[] = [
  { slug: 'silicona', label: 'Silicona' },
  { slug: 'cuero', label: 'Cuero' },
  { slug: 'diseno', label: 'Diseño' },
  { slug: 'hibrido', label: 'Híbrido' },
];

export function accessoriesHref(params: AccesoriosQuery): string {
  const sp = new URLSearchParams();
  if (params.tipo) sp.set('tipo', params.tipo);
  if (params.brand) sp.set('brand', params.brand);
  if (params.modelo) sp.set('modelo', params.modelo);
  if (params.material) sp.set('material', params.material);
  if (params.kind) sp.set('kind', params.kind);
  if (params.marca) sp.set('marca', params.marca);
  const q = sp.toString();
  return q ? `/accesorios?${q}` : '/accesorios';
}

export function patchAccesoriosQuery(
  current: AccesoriosQuery,
  patch: AccesoriosQuery,
): AccesoriosQuery {
  const next: AccesoriosQuery = { ...current, ...patch };

  if (patch.tipo !== undefined) {
    const type = ACCESSORY_TYPES.find((t) => t.slug === patch.tipo);
    next.kind = type?.kind;
    if (type?.kind === 'laptop') {
      if (current.kind !== 'laptop') next.modelo = undefined;
    }
  }

  if (patch.brand !== undefined && patch.brand !== current.brand) {
    next.modelo = undefined;
  }

  if (patch.tipo === '') {
    next.tipo = undefined;
    next.kind = undefined;
  }

  return next;
}
