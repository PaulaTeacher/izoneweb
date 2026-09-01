import { test, expect } from '@playwright/test';

test('Flujo E2E: PDP hacia Checkout de WhatsApp', async ({ page }) => {
  // 1. Navegar a la PDP
  await page.goto('/product/iphone-16-pro');

  // 2. Verificar Metadatos de SEO y Título
  await expect(page).toHaveTitle(/iPhone 16 Pro/i);

  // 3. Accesibilidad: Verificar que el input tenga un placeholder claro o label
  const nameInput = page.locator('input[placeholder="Nombre del cliente..."]');
  await expect(nameInput).toBeVisible();
  
  // 4. Llenar el formulario
  await nameInput.fill('Usuario Playwright');

  // 5. Interceptar la llamada API (para no mandar WhatsApps reales en los tests)
  await page.route('**/whatsapp/checkout', async (route) => {
    await route.fulfill({ json: { url: 'https://wa.me/mocked', total: 5499000 } });
  });

  // 6. Validar que el botón es cliqueable
  const whatsappBtn = page.locator('button:has-text("Comprar por WhatsApp")');
  await expect(whatsappBtn).toBeEnabled();
});
