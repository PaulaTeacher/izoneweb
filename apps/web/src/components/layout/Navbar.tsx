import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">iZone Tech</Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
          <Link href="/catalog" className="hover:text-black">Catálogo</Link>
          <Link href="/catalog?category=smartphones" className="hover:text-black">iPhone</Link>
          <Link href="/catalog?category=laptops" className="hover:text-black">Mac</Link>
          <Link href="/catalog?category=audio" className="hover:text-black">AirPods</Link>
        </nav>
        <div className="flex items-center gap-4 text-neutral-800">
          <button aria-label="Buscar"><Search className="w-5 h-5" /></button>
          <button aria-label="Carrito"><ShoppingBag className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
}
