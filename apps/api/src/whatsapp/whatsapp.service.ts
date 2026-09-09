import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutShippingInput {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface CheckoutRequest {
  items: CheckoutItemInput[];
  customerName: string;
  couponCode?: string;
  shipping?: CheckoutShippingInput;
}

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

  async generateCheckoutLink(data: CheckoutRequest) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    let subtotal = 0;
    const validatedItems: {
      productId: string;
      variantId: string;
      name: string;
      colorName?: string | null;
      storage?: string | null;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of data.items) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException(`Variante con ID ${item.variantId} no encontrada`);
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${variant.product.name} (${variant.colorName || ''}). Disponible: ${variant.stock}`,
        );
      }

      const priceNum = Number(variant.price);
      const itemSubtotal = priceNum * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: variant.productId,
        variantId: variant.id,
        name: variant.product.name,
        colorName: variant.colorName,
        storage: variant.storage,
        quantity: item.quantity,
        unitPrice: priceNum,
        subtotal: itemSubtotal,
      });
    }

    // Calcular descuento si hay cupón
    let discount = 0;
    let validCouponCode: string | undefined = undefined;
    if (data.couponCode) {
      try {
        const couponResult = await this.validateCoupon(data.couponCode, subtotal);
        discount = couponResult.discountAmount;
        validCouponCode = couponResult.code;
      } catch (err: any) {
        throw new BadRequestException(err.message || 'Cupón inválido');
      }
    }

    const totalAmount = Math.max(0, subtotal - discount);

    // Formato COP para mensajes
    const formatCOP = (val: number) =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(val);

    // Crear registro transaccional de orden en Supabase
    const order = await this.prisma.order.create({
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
        items: {
          create: validatedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: `${i.name} (${[i.colorName, i.storage].filter(Boolean).join(' - ')})`,
            quantity: i.quantity,
            price: i.unitPrice,
          })),
        },
      },
    });

    // Incrementar contador de cupón si se usó
    if (validCouponCode) {
      await this.prisma.coupon.update({
        where: { code: validCouponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Construir mensaje estructurado para WhatsApp
    const orderRef = order.id.slice(0, 8).toUpperCase();
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

    for (const item of validatedItems) {
      const details = [item.colorName, item.storage].filter(Boolean).join(' / ');
      message += `• *${item.quantity}x* ${item.name} ${details ? `(${details})` : ''}\n  Precio: ${formatCOP(item.unitPrice)}\n`;
    }

    message += `\n──────────────\n`;
    message += `Subtotal: ${formatCOP(subtotal)}\n`;
    if (discount > 0) {
      message += `🎟️ Descuento (${validCouponCode}): -${formatCOP(discount)}\n`;
    }
    message += `*Total a Pagar:* ${formatCOP(totalAmount)}\n`;
    message += `──────────────\n\n`;
    message += `¿Me confirman disponibilidad y los datos para realizar la transferencia? ¡Gracias!`;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return {
      orderId: order.id,
      orderRef,
      url,
      subtotal,
      discount,
      total: totalAmount,
    };
  }
}
