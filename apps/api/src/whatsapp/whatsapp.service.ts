import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  constructor(private prisma: PrismaService) {}

  async generateCheckoutLink(data: { items: { variantId: string, quantity: number }[], customerName: string }) {
    if (!data.items || data.items.length === 0) throw new BadRequestException('Carrito vacío');

    let total = 0;
    let message = `¡Hola! Soy ${data.customerName}. Quiero realizar el siguiente pedido:\n\n`;

    for (const item of data.items) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });
      if (!variant) throw new BadRequestException(`Variante ${item.variantId} no encontrada`);

      const subtotal = variant.price * item.quantity;
      total += subtotal;

      message += `- ${item.quantity}x ${variant.product.name} (${variant.color || ''}, ${variant.storage || ''}) - $${variant.price}\n`;
    }

    message += `\n*Total Estimado: $${total}*`;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573000000000';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return { url, total };
  }
}
