const FALLBACK_NUMBER = '573001234567';

/** Digits-only WhatsApp number from env (Colombia: 57…). */
export function getWhatsappNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK_NUMBER;
  const digits = raw.replace(/\D/g, '');
  return digits || FALLBACK_NUMBER;
}

/** Build a wa.me deep link with prefilled message. */
export function buildWaMeUrl(text: string): string {
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(text)}`;
}
