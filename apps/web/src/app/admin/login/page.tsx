'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@izone.co');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 space-y-4"
      >
        <div>
          <p className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
            iZone Tech
          </p>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Admin</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Catálogo interno · precio, stock y visibilidad
          </p>
        </div>

        <label className="block text-sm">
          <span className="text-neutral-600">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-neutral-900"
          />
        </label>

        <label className="block text-sm">
          <span className="text-neutral-600">Contraseña</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-neutral-900"
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
