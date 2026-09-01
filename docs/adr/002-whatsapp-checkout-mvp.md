# ADR-002: Checkout MVP vía WhatsApp (sin pasarela de pagos)

## Estado
Aceptado

## Fecha
2026-09-01

## Contexto
El modelo de conversión de iZone Tech requiere definir cómo se cierran las ventas. El mercado colombiano tiene particularidades: alta adopción de WhatsApp Business, complejidad de facturación electrónica DIAN, y múltiples pasarelas de pago (Wompi, PayU, MercadoPago).

## Opciones Consideradas
1. **Opción A (MVP):** Checkout 100% vía WhatsApp — carrito genera enlace `wa.me` con resumen del pedido.
2. **Opción B:** Pasarela de pagos online (Wompi/PayU/MercadoPago) con checkout completo.

## Decisión
Se eligió la **Opción A** para el MVP.

## Justificación
- **Tiempo de mercado:** Permite lanzar sin integrar pasarela de pagos ni facturación DIAN.
- **Confianza:** En Colombia, muchos compradores prefieren la atención personalizada vía WhatsApp antes de pagar.
- **Simplicidad legal:** No requiere facturación electrónica inmediata.
- **Rate limiting:** El endpoint de generación de enlaces se protege con throttling para evitar abuso.

## Consecuencias
- **Positivas:** Lanzamiento rápido, atención personalizada, menor complejidad.
- **Negativas:** No hay pago en línea, cada venta requiere intervención humana en WhatsApp.
- **Evolución:** En Fase 2 se puede agregar pasarela de pagos. El modelo `Order` ya soporta `paymentMethod` para soportar ambos flujos.
