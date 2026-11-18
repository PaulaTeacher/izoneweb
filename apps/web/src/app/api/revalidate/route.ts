import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Mismos roles que pueden editar el catálogo en la API (admin.controller.ts)
const CATALOG_ROLES = ['SUPERADMIN', 'ADMIN_INVENTARIO', 'EDITOR'];

/**
 * Invalida caché del catálogo tras cambios en Admin.
 * Requiere Bearer JWT de admin (verificado contra Nest /auth/me).
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const me = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: auth },
      cache: 'no-store',
    });
    if (!me.ok) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    const user = (await me.json().catch(() => null)) as { role?: string } | null;
    if (!user?.role || !CATALOG_ROLES.includes(user.role)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Auth service unavailable' },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const tag = typeof body.tag === 'string' ? body.tag : 'catalog';

  revalidateTag(tag);
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/iphone');
  revalidatePath('/mac');
  revalidatePath('/ipad');
  revalidatePath('/watch');
  revalidatePath('/audio');
  revalidatePath('/accesorios');
  revalidatePath('/trade-in');
  revalidatePath('/politicas');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ ok: true, revalidated: true, tag, at: new Date().toISOString() });
}
