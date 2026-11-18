/**
 * Placeholder used ONLY in local development when NEXT_PUBLIC_WHATSAPP_NUMBER
 * is not set. Production builds refuse to use it so orders can never be sent
 * to a number that does not belong to the store.
 */
const DEV_PLACEHOLDER_NUMBER = '573001234567';

/** Digits-only WhatsApp number from env (Colombia: 57…). */
export function getWhatsappNumber(): string {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (digits) return digits;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER no está configurado. Defínelo (solo dígitos, con 57) antes de compilar para producción.',
    );
  }
  return DEV_PLACEHOLDER_NUMBER;
}

/** Build a wa.me deep link with prefilled message. */
export function buildWaMeUrl(text: string): string {
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(text)}`;
}
