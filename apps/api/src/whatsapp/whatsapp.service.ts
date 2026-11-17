import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutRequestDto } from './dto/checkout.dto';

@Injectable()
export class WhatsappService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(code: string, orderSubtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('El cupón no es válido o está inactivo');
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      throw new BadRequestException('El cupón ha expirado');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('El cupón ha alcanzado el límite de usos');
    }

    if (coupon.minOrderAmount && orderSubtotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `El pedido mínimo para este cupón es de $${coupon.minOrderAmount}`,
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * Number(coupon.discountValue)) / 100;
    } else {
      discount = Number(coupon.discountValue);
    }

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount: Math.min(discount, orderSubtotal),
    };
  }

  async generateCheckoutLink(data: CheckoutRequestDto) {
    if (!data.items?.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    type ValidatedItem = {
      productId: string;
      variantId: string;
      name: string;
      slug: string;
      sku?: string | null;
      colorName?: string | null;
      storage?: string | null;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      hasProtection?: boolean;
    };

    const formatCOP = (val: number) =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(val);

    const result = await this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const validatedItems: ValidatedItem[] = [];

      for (const item of data.items) {
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || !variant.product.isActive) {
          throw new NotFoundException(
            `Variante con ID ${item.variantId} no encontrada`,
          );
        }

        const available = variant.stock - variant.reservedStock;
        if (available < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para ${variant.product.name} (${variant.colorName || ''}). Disponible: ${Math.max(0, available)}`,
          );
        }

        const reserved = await tx.variant.updateMany({
          where: {
            id: variant.id,
            // Re-check race: stock - reservedStock >= qty after concurrent check
            reservedStock: { lte: variant.stock - item.quantity },
          },
          data: { reservedStock: { increment: item.quantity } },
        });

        if (reserved.count === 0) {
          throw new BadRequestException(
            `Stock insuficiente para ${variant.product.name}. Intenta de nuevo.`,
          );
        }

        const priceNum = Number(variant.price) + (item.hasProtection ? 189000 : 0);
        const itemSubtotal = priceNum * item.quantity;
        subtotal += itemSubtotal;

        validatedItems.push({
          productId: variant.productId,
          variantId: variant.id,
          name: variant.product.name,
          slug: variant.product.slug,
          sku: variant.sku,
          colorName: variant.colorName,
          storage: variant.storage,
          quantity: item.quantity,
          unitPrice: priceNum,
          subtotal: itemSubtotal,
          hasProtection: item.hasProtection,
        });
      }

      let discount = 0;
      let validCouponCode: string | undefined;
      if (data.couponCode) {
        const couponResult = await this.validateCouponInTx(
          tx,
          data.couponCode,
          subtotal,
        );
        discount = couponResult.discountAmount;
        validCouponCode = couponResult.code;

        await tx.coupon.update({
          where: { code: validCouponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      const totalAmount = Math.max(0, subtotal - discount);
      const reservedUntil = new Date(Date.now() + 30 * 60 * 1000);

      const order = await tx.order.create({
        data: {
          subtotal,
          discount,
          totalAmount,
          couponCode: validCouponCode,
          shippingName: data.shipping?.name || data.customerName,
          shippingPhone: data.shipping?.phone,
          shippingAddress: data.shipping?.address,
          shippingCity: data.shipping?.city,
          shippingNotes: data.shipping?.notes,
          paymentMethod: 'whatsapp',
          status: 'reserved',
          reservedUntil,
          items: {
            create: validatedItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              name: `${i.name} (${[i.colorName, i.storage].filter(Boolean).join(' - ')})${i.hasProtection ? ' (Con Protección)' : ''}`,
              quantity: i.quantity,
              price: i.unitPrice,
            })),
          },
        },
      });

      return { order, validatedItems, subtotal, discount, totalAmount, validCouponCode };
    });

    const orderRef = result.order.id.slice(0, 8).toUpperCase();
    let message = `*¡Hola iZone Tech! Quiero confirmar mi pedido.*\n\n`;
    message += `📋 *Pedido:* #${orderRef}\n`;
    message += `👤 *Cliente:* ${data.customerName}\n`;
    if (data.shipping?.city) {
      message += `📍 *Ciudad de entrega:* ${data.shipping.city}\n`;
    }
    if (data.shipping?.address) {
      message += `🏠 *Dirección:* ${data.shipping.address}\n`;
    }
    message += `\n📦 *Productos:*\n`;

    for (const item of result.validatedItems) {
      const details = [item.colorName, item.storage].filter(Boolean).join(' / ');
      const protectionNote = item.hasProtection ? ' *(Con Protección 12 Meses)*' : '';
      message += `• *${item.quantity}x* ${item.name}${details ? ` (${details})` : ''}${protectionNote}\n`;
      if (item.sku) {
        message += `  SKU: ${item.sku}\n`;
      }
      message += `  Link: /product/${item.slug}\n`;
      message += `  Precio: ${formatCOP(item.unitPrice)}\n`;
    }

    message += `\n──────────────\n`;
    message += `Subtotal: ${formatCOP(result.subtotal)}\n`;
    if (result.discount > 0) {
      message += `🎟️ Descuento (${result.validCouponCode}): -${formatCOP(result.discount)}\n`;
    }
    message += `*Total a Pagar:* ${formatCOP(result.totalAmount)}\n`;
    message += `──────────────\n\n`;
    message += `¿Me confirman disponibilidad y los datos para realizar la transferencia? ¡Gracias!`;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return {
      orderId: result.order.id,
      orderRef,
      url,
      subtotal: result.subtotal,
      discount: result.discount,
      total: result.totalAmount,
    };
  }

  private async validateCouponInTx(
    tx: Prisma.TransactionClient,
    code: string,
    orderSubtotal: number,
  ) {
    const coupon = await tx.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('El cupón no es válido o está inactivo');
    }
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      throw new BadRequestException('El cupón ha expirado');
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('El cupón ha alcanzado el límite de usos');
    }
    if (coupon.minOrderAmount && orderSubtotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `El pedido mínimo para este cupón es de $${coupon.minOrderAmount}`,
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * Number(coupon.discountValue)) / 100;
    } else {
      discount = Number(coupon.discountValue);
    }

    return {
      code: coupon.code,
      discountAmount: Math.min(discount, orderSubtotal),
    };
  }
}
