'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export default function Navbar() {
  const { openCart, totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'iPhone', href: '/#smartphones' },
    { name: 'Mac', href: '/#macbooks' },
    { name: 'iPad', href: '/#ipad' },
    { name: 'Apple Watch', href: '/#apple-watch' },
    { name: 'Audio', href: '/#audio' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm tracking-tighter">
            iZ
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:text-blue-600 transition">
            iZone Tech
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Buscar producto"
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            aria-label="Abrir bolsa de compras"
            className="relative p-2 text-neutral-800 dark:text-white hover:opacity-80 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black animate-scale-up">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white dark:bg-black px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-neutral-700 dark:text-neutral-200 py-1"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
