/** Placeholder only for local development/tests; never used in production. */
const DEV_PLACEHOLDER_NUMBER = '573001234567';

/**
 * Store WhatsApp number (digits only, with country code 57). Throws in
 * production when it is missing so checkout links can never point to a
 * number that does not belong to the store.
 */
export function getStoreWhatsappNumber(): string {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (digits) return digits;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_WHATSAPP_NUMBER is required in production');
  }
  return DEV_PLACEHOLDER_NUMBER;
}
