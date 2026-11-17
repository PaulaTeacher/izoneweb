import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WhatsappService', () => {
  let service: WhatsappService;

  const variant = {
    id: 'var-1',
    price: 5499000,
    stock: 10,
    reservedStock: 0,
    colorName: 'Titanio',
    storage: '256GB',
    productId: 'prod-1',
    product: { name: 'iPhone 16 Pro', isActive: true },
  };

  const tx = {
    variant: {
      findUnique: vi.fn().mockResolvedValue(variant),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    order: {
      create: vi.fn().mockResolvedValue({ id: 'order-abcdef12-xxxx' }),
    },
    coupon: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    tx.variant.findUnique.mockResolvedValue(variant);
    tx.variant.updateMany.mockResolvedValue({ count: 1 });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
            coupon: { findUnique: vi.fn() },
          },
        },
      ],
    }).compile();

    service = module.get(WhatsappService);
  });

  it('calcula total, reserva stock y genera wa.me', async () => {
    const result = await service.generateCheckoutLink({
      items: [{ variantId: 'var-1', quantity: 2 }],
      customerName: 'Juan QA',
    });

    expect(result.total).toBe(10998000);
    expect(result.url).toContain('wa.me');
    expect(result.url).toContain('Juan%20QA');
    expect(result.url).toContain('iPhone%2016%20Pro');
    expect(tx.variant.updateMany).toHaveBeenCalled();
    expect(tx.order.create).toHaveBeenCalled();
  });

  it('rechaza si no hay stock disponible', async () => {
    tx.variant.findUnique.mockResolvedValue({
      ...variant,
      stock: 1,
      reservedStock: 0,
    });
    tx.variant.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.generateCheckoutLink({
        items: [{ variantId: 'var-1', quantity: 2 }],
        customerName: 'Juan QA',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('suma el plan de protección por unidad al precio y lo indica en el mensaje', async () => {
    const result = await service.generateCheckoutLink({
      items: [{ variantId: 'var-1', quantity: 2, hasProtection: true }],
      customerName: 'Juan QA',
    });

    // (5.499.000 + 189.000) * 2
    expect(result.total).toBe(11376000);
    expect(decodeURIComponent(result.url)).toContain('Con Protección 12 Meses');
    const created = tx.order.create.mock.calls[0][0].data;
    expect(created.items.create[0].price).toBe(5688000);
    expect(created.items.create[0].name).toContain('(Con Protección)');
  });

  it('aplica cupón porcentual, lo cuenta como usado y descuenta del total', async () => {
    tx.coupon.findUnique.mockResolvedValue({
      code: 'IZONE10',
      isActive: true,
      discountType: 'percentage',
      discountValue: 10,
      validUntil: null,
      maxUses: null,
      usedCount: 0,
      minOrderAmount: null,
    });

    const result = await service.generateCheckoutLink({
      items: [{ variantId: 'var-1', quantity: 1 }],
      customerName: 'Juan QA',
      couponCode: 'izone10',
    });

    expect(result.subtotal).toBe(5499000);
    expect(result.discount).toBeCloseTo(549900);
    expect(result.total).toBeCloseTo(4949100);
    expect(tx.coupon.update).toHaveBeenCalledWith({
      where: { code: 'IZONE10' },
      data: { usedCount: { increment: 1 } },
    });
  });

  it('rechaza un cupón expirado', async () => {
    tx.coupon.findUnique.mockResolvedValue({
      code: 'VIEJO',
      isActive: true,
      discountType: 'fixed',
      discountValue: 50000,
      validUntil: new Date('2020-01-01'),
      maxUses: null,
      usedCount: 0,
      minOrderAmount: null,
    });

    await expect(
      service.generateCheckoutLink({
        items: [{ variantId: 'var-1', quantity: 1 }],
        customerName: 'Juan QA',
        couponCode: 'VIEJO',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it('rechaza un carrito vacío', async () => {
    await expect(
      service.generateCheckoutLink({ items: [], customerName: 'Juan QA' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
