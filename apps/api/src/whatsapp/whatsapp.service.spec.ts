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
});
