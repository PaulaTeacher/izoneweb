import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Admin | iZone Tech',
  },
  description: 'Panel de administración iZone Tech — acceso restringido.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: undefined,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {children}
    </div>
  );
}
