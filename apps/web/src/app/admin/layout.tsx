import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | iZone Tech',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {children}
    </div>
  );
}
