import { test, expect } from '@playwright/test';

test('Flujo de Checkout con Cupón', async ({ page }) => {
  // 1. Navegar a la página principal
  await page.goto('/');

  // Verificar que estamos en la home
  await expect(page).toHaveTitle(/iZone/i);

  // 2. Ir a un producto (simulamos clic en el primer enlace que tenga href a /product/)
  const productLink = page.locator('a[href^="/product/"]').first();
  await expect(productLink).toBeVisible();
  await productLink.click();

  // Esperar a que la página del producto cargue
  await page.waitForURL(/\/product\//);

  // Seleccionar una variante si es necesario (asumimos que la primera está seleccionada por defecto, si no, intentamos hacer clic en la primera opción de color/almacenamiento si existe)
  // 3. Agregar al carrito
  const addToCartBtn = page.locator('button').filter({ hasText: /Agregar a la Bolsa/i }).first();
  await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  await addToCartBtn.click({ force: true });

  // 4. Abrir carrito
  const cartIcon = page.locator('header button').filter({ hasText: /0|1|2|3/i }).first();
  if (await cartIcon.isVisible()) {
    await cartIcon.click();
  }

  // 5. Aplicar cupón
  // El input de cupón
  const couponInput = page.getByPlaceholder(/cupón/i).or(page.getByPlaceholder(/código/i));
  await expect(couponInput).toBeVisible();
  await couponInput.fill('WELCOME10');
  
  const applyBtn = page.getByRole('button', { name: /aplicar/i });
  await applyBtn.click();

  // Verificar que el cupón se haya aplicado (buscando texto relacionado)
  const discountText = page.getByText(/descuento|-\$/i).first();
  await expect(discountText).toBeVisible();

  // 6. Verificar botón de WhatsApp
  const whatsappBtn = page.getByRole('button', { name: /whatsapp|comprar/i }).first();
  await expect(whatsappBtn).toBeVisible();
});
