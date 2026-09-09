import { test, expect } from '@playwright/test';

test('Flujo de Checkout con Cupón', async ({ page }) => {
  // 1. Navegar a la página principal
  await page.goto('/');

  // Verificar que estamos en la home
  await expect(page).toHaveTitle(/iZone/i);

  // 2. Ir a un producto (buscamos un enlace de producto dentro de la grilla de productos)
  const productLink = page.locator('a[href^="/product/"]').filter({ hasText: /Desde/i }).first();
  await expect(productLink).toBeVisible();
  await productLink.click();

  // Esperar a que la página del producto cargue
  await page.waitForURL(/\/product\//);

  // Seleccionar una variante si es necesario (asumimos que la primera está seleccionada por defecto, si no, intentamos hacer clic en la primera opción de color/almacenamiento si existe)
  // 3. Agregar al carrito
  const addToCartBtn = page.locator('button').filter({ hasText: /Agregar a la Bolsa/i }).first();
  await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  await addToCartBtn.click({ force: true });

  // 4. Verificar que el carrito esté abierto (addItem lo abre automáticamente)
  const couponInput = page.getByPlaceholder(/cupón/i).or(page.getByPlaceholder(/código/i));
  if (!(await couponInput.isVisible())) {
    const cartIcon = page.locator('header button[aria-label="Ver carrito de compras"]').first();
    await cartIcon.click({ force: true });
  }

  // 5. Aplicar cupón
  await expect(couponInput).toBeVisible({ timeout: 10000 });
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
