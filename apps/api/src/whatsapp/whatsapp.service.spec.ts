import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: PrismaService,
          useValue: {
            variant: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'var-1',
                price: 5499000,
                product: { name: 'iPhone 16 Pro' },
                color: 'Titanio',
                storage: '256GB'
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería calcular el total correctamente y generar un enlace de wa.me', async () => {
    const result = await service.generateCheckoutLink({
      items: [{ variantId: 'var-1', quantity: 2 }],
      customerName: 'Juan QA'
    });

    expect(result.total).toBe(10998000); // 5,499,000 * 2
    expect(result.url).toContain('wa.me');
    expect(result.url).toContain('Juan%20QA'); // URL-encoded
    expect(result.url).toContain('iPhone%2016%20Pro');
  });
});
