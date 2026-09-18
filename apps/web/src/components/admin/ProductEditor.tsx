'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  adminFetch,
  bustStorefrontCache,
} from '@/lib/admin-api';

export type AdminVariant = {
  id?: string;
  sku: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
  colorName?: string | null;
  colorHex?: string | null;
  storage?: string | null;
  featuredImage?: string | null;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive: boolean;
  isFeatured?: boolean;
  productKind: string;
  images?: string[];
  brandId?: string;
  categoryId?: string;
  brand?: { id?: string; name: string } | null;
  category?: { id?: string; name: string; parent?: { name: string } | null } | null;
  variants: AdminVariant[];
};

type Brand = { id: string; name: string };
type Category = {
  id: string;
  name: string;
  parent?: { name: string } | null;
};

function money(v: number | string | null | undefined) {
  const n = typeof v === 'string' ? Number(v) : v ?? 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseImages(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyVariant(): AdminVariant {
  return {
    sku: '',
    price: 0,
    comparePrice: '',
    stock: 0,
    colorName: '',
    storage: '',
    featuredImage: '',
  };
}

export function ProductEditor({
  mode,
  product,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [description, setDescription] = useState(product?.description || '');
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || '');
  const [productKind, setProductKind] = useState<'equipment' | 'accessory'>(
    product?.productKind === 'accessory' ? 'accessory' : 'equipment',
  );
  const [brandId, setBrandId] = useState(product?.brandId || product?.brand?.id || '');
  const [categoryId, setCategoryId] = useState(
    product?.categoryId || product?.category?.id || '',
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [imagesText, setImagesText] = useState((product?.images || []).join('\n'));
  const [variants, setVariants] = useState<AdminVariant[]>(
    product?.variants?.length ? product.variants.map((v) => ({ ...v })) : [emptyVariant()],
  );
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [metaLoading, setMetaLoading] = useState(mode === 'create');

  const imagePreviews = useMemo(() => parseImages(imagesText).slice(0, 8), [imagesText]);
  const selected = variants[selectedVariantIdx] || variants[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [b, c] = await Promise.all([
          adminFetch<Brand[]>('/admin/brands'),
          adminFetch<Category[]>('/admin/categories'),
        ]);
        if (cancelled) return;
        setBrands(b);
        setCategories(c);
        if (mode === 'create') {
          if (!brandId && b[0]) setBrandId(b[0].id);
          if (!categoryId && c[0]) setCategoryId(c[0].id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar marcas/categorías');
        }
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const updateVariantField = <K extends keyof AdminVariant>(
    index: number,
    key: K,
    value: AdminVariant[K],
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, emptyVariant()]);
    setSelectedVariantIdx(variants.length);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const images = parseImages(imagesText);
    const cleanedVariants = variants
      .map((v) => ({
        ...v,
        sku: String(v.sku || '').trim(),
        price: Number(v.price),
        stock: Number(v.stock || 0),
        comparePrice:
          v.comparePrice === '' || v.comparePrice == null || Number.isNaN(Number(v.comparePrice))
            ? null
            : Number(v.comparePrice),
        colorName: String(v.colorName || '').trim() || null,
        colorHex: String(v.colorHex || '').trim() || null,
        storage: String(v.storage || '').trim() || null,
        featuredImage: String(v.featuredImage || '').trim() || null,
      }))
      .filter((v) => v.sku);

    if (!name.trim() || !slug.trim()) {
      setError('Nombre y slug son obligatorios');
      setSaving(false);
      return;
    }
    if (!cleanedVariants.length) {
      setError('Agrega al menos una variante con SKU');
      setSaving(false);
      return;
    }
    if (cleanedVariants.some((v) => !Number.isFinite(v.price) || v.price < 0)) {
      setError('Revisa los precios de las variantes');
      setSaving(false);
      return;
    }

    try {
      if (mode === 'create') {
        if (!brandId || !categoryId) {
          throw new Error('Selecciona marca y categoría');
        }
        await adminFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim() || name.trim(),
            brandId,
            categoryId,
            productKind,
            images,
            isActive,
            isFeatured,
            seoTitle: seoTitle.trim() || undefined,
            seoDescription: seoDescription.trim() || undefined,
            variants: cleanedVariants.map((v) => ({
              sku: v.sku,
              price: v.price,
              comparePrice: v.comparePrice,
              stock: v.stock,
              colorName: v.colorName,
              colorHex: v.colorHex,
              storage: v.storage,
              featuredImage: v.featuredImage,
            })),
          }),
        });
        await bustStorefrontCache();
      } else if (product) {
        await adminFetch(`/admin/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || undefined,
            images,
            isActive,
            isFeatured,
            seoTitle: seoTitle.trim() || null,
            seoDescription: seoDescription.trim() || null,
            variants: cleanedVariants.map((v) => ({
              ...(v.id ? { id: v.id } : {}),
              sku: v.sku,
              price: v.price,
              comparePrice: v.comparePrice,
              stock: v.stock,
              colorName: v.colorName,
              colorHex: v.colorHex,
              storage: v.storage,
              featuredImage: v.featuredImage,
            })),
          }),
        });
      }
      await bustStorefrontCache();
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <form
        onSubmit={save}
        className="w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl"
      >
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Variantes, precios, stock e imágenes (URL).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm"
          >
            Cerrar
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {error ? (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          ) : null}

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Información</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-sm sm:col-span-2">
                <span className="text-neutral-600">Nombre</span>
                <input
                  value={name}
                  onChange={(e) => {
                    const next = e.target.value;
                    setName(next);
                    if (!slugTouched) setSlug(slugify(next));
                  }}
                  required
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="text-neutral-600">Slug</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  required
                  disabled={mode === 'edit'}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 disabled:bg-neutral-50"
                />
              </label>
              <label className="block text-sm">
                <span className="text-neutral-600">Tipo</span>
                <select
                  value={productKind}
                  onChange={(e) => setProductKind(e.target.value as 'equipment' | 'accessory')}
                  disabled={mode === 'edit'}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 disabled:bg-neutral-50"
                >
                  <option value="equipment">Equipo</option>
                  <option value="accessory">Accesorio</option>
                </select>
              </label>
              {mode === 'create' ? (
                <>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Marca</span>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      required
                      disabled={metaLoading}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Categoría</span>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      disabled={metaLoading}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.parent ? `${c.parent.name} › ` : ''}
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}
            </div>
            <label className="block text-sm">
              <span className="text-neutral-600">Descripción</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
                placeholder="Texto corto para la ficha del producto"
              />
            </label>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">SEO (Google &amp; IAs)</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Título y meta descripción de la ficha. Si los dejas vacíos se generan
                  automáticamente con foco Colombia/Bogotá.
                </p>
              </div>
              <label className="block text-sm">
                <span className="text-neutral-600">Meta título</span>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={70}
                  placeholder={`${name || 'Producto'} precio Colombia | iZone Tech`}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                />
                <span className="text-[11px] text-neutral-400">{seoTitle.length}/70</span>
              </label>
              <label className="block text-sm">
                <span className="text-neutral-600">Meta descripción</span>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  maxLength={160}
                  rows={2}
                  placeholder="Incluye beneficio, ciudad y llamada a la acción (máx. ~160 caracteres)."
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                />
                <span className="text-[11px] text-neutral-400">{seoDescription.length}/160</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                Visible en tienda
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                Destacado
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Imágenes del producto</h3>
            <p className="text-xs text-neutral-500">
              Una URL por línea (CDN Apple, Cloudinary, etc.). La primera es la principal.
            </p>
            <textarea
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 font-mono text-xs"
              placeholder="https://…"
            />
            {imagePreviews.length ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imagePreviews.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover border border-neutral-200 bg-neutral-50 shrink-0"
                  />
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                Variantes ({variants.length})
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                + Agregar variante
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.map((v, idx) => (
                <button
                  key={v.id || `new-${idx}`}
                  type="button"
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border ${
                    idx === selectedVariantIdx
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200'
                  }`}
                >
                  {v.sku || `Nueva ${idx + 1}`}
                  {v.price ? ` · ${money(v.price)}` : ''}
                </button>
              ))}
            </div>

            {selected ? (
              <div className="grid sm:grid-cols-2 gap-3 rounded-2xl border border-neutral-200 p-4 bg-neutral-50/60">
                <label className="block text-sm">
                  <span className="text-neutral-600">SKU</span>
                  <input
                    value={selected.sku}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'sku', e.target.value)
                    }
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Almacenamiento</span>
                  <input
                    value={selected.storage || ''}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'storage', e.target.value)
                    }
                    placeholder="256 GB"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Color</span>
                  <input
                    value={selected.colorName || ''}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'colorName', e.target.value)
                    }
                    placeholder="Titanio natural"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Hex color</span>
                  <input
                    value={selected.colorHex || ''}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'colorHex', e.target.value)
                    }
                    placeholder="#C0BCB4"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Precio (COP)</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={selected.price === '' ? '' : Number(selected.price)}
                    onChange={(e) =>
                      updateVariantField(
                        selectedVariantIdx,
                        'price',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Precio tachado</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={
                      selected.comparePrice == null || selected.comparePrice === ''
                        ? ''
                        : Number(selected.comparePrice)
                    }
                    onChange={(e) =>
                      updateVariantField(
                        selectedVariantIdx,
                        'comparePrice',
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-neutral-600">Stock</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={selected.stock}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'stock', Number(e.target.value || 0))
                    }
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="text-neutral-600">Imagen de la variante (URL)</span>
                  <input
                    value={selected.featuredImage || ''}
                    onChange={(e) =>
                      updateVariantField(selectedVariantIdx, 'featuredImage', e.target.value)
                    }
                    placeholder="https://…"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  />
                </label>
              </div>
            ) : null}
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || metaLoading}
            className="flex-1 rounded-xl bg-neutral-900 text-white py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Guardando…' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
