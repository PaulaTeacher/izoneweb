'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAdminSession, type AdminSessionUser } from '@/lib/admin-api';

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminSessionUser | null;
}) {
  const router = useRouter();

  const logout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold tracking-tight">
              iZone Admin
            </Link>
            <nav className="flex gap-4 text-sm text-neutral-600">
              <Link href="/admin" className="hover:text-neutral-900">
                Productos
              </Link>
              <Link href="/admin/orders" className="hover:text-neutral-900">
                Pedidos
              </Link>
              <Link href="/" className="hover:text-neutral-900" target="_blank">
                Tienda ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <span className="text-neutral-500 hidden sm:inline">
                {user.email} · {user.role}
              </span>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
