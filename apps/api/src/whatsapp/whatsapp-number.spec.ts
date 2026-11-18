import { getStoreWhatsappNumber } from './whatsapp-number';

describe('getStoreWhatsappNumber', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it('returns digits only from the env var', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '+57 310 555 0000';
    expect(getStoreWhatsappNumber()).toBe('573105550000');
  });

  it('throws in production when the number is missing', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    process.env.NODE_ENV = 'production';
    expect(() => getStoreWhatsappNumber()).toThrow(/required in production/);
  });

  it('uses a dev placeholder outside production', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    process.env.NODE_ENV = 'test';
    expect(getStoreWhatsappNumber()).toMatch(/^57\d{10}$/);
  });
});
