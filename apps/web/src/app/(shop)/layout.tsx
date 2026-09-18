import dynamic from 'next/dynamic';
import TopAnnouncementBar from '@/components/layout/TopAnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/cart-context';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), {
  ssr: false,
});
const FloatingWhatsApp = dynamic(
  () => import('@/components/layout/FloatingWhatsApp'),
  { ssr: false },
);

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline focus:outline-2 focus:outline-[#0071E3]"
      >
        Saltar al contenido
      </a>
      <TopAnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <CartDrawer />
      <FloatingWhatsApp />
      <Footer />
    </CartProvider>
  );
}
