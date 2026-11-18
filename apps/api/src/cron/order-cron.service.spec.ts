import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderCronService, internalCronEnabled } from './order-cron.service';

describe('OrderCronService.releaseExpiredReservations', () => {
  const tx = {
    variant: { updateMany: vi.fn() },
    order: { updateMany: vi.fn() },
  };

  const prisma = {
    order: { findMany: vi.fn() },
    $transaction: vi.fn(),
  };

  let service: OrderCronService;

  beforeEach(() => {
    vi.clearAllMocks();
    tx.variant.updateMany.mockResolvedValue({ count: 1 });
    tx.order.updateMany.mockResolvedValue({ count: 1 });
    prisma.$transaction.mockImplementation((fn: (client: typeof tx) => Promise<unknown>) => fn(tx));
    service = new OrderCronService(prisma as never);
  });

  it('no hace nada si no hay reservas vencidas', async () => {
    prisma.order.findMany.mockResolvedValue([]);

    await expect(service.releaseExpiredReservations()).resolves.toEqual({
      expired: 0,
      released: 0,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('busca solo órdenes reservadas cuya reserva ya venció', async () => {
    prisma.order.findMany.mockResolvedValue([]);
    const now = new Date('2026-11-18T12:00:00Z');

    await service.releaseExpiredReservations(now);

    const where = prisma.order.findMany.mock.calls[0][0].where;
    expect(where.status).toBe('reserved');
    expect(where.reservedUntil.lt).toBe(now);
  });

  it('cancela la orden (solo si sigue reservada) y devuelve el stock', async () => {
    prisma.order.findMany.mockResolvedValue([
      {
        id: 'order-1',
        items: [
          { variantId: 'var-1', quantity: 2 },
          { variantId: 'var-2', quantity: 1 },
        ],
      },
    ]);

    await expect(service.releaseExpiredReservations()).resolves.toEqual({
      expired: 1,
      released: 1,
    });

    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order-1', status: 'reserved' },
      data: { status: 'cancelled' },
    });
    expect(tx.variant.updateMany).toHaveBeenCalledTimes(2);
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: { id: 'var-1', reservedStock: { gte: 2 } },
      data: { reservedStock: { decrement: 2 } },
    });
  });

  it('no devuelve stock si otra ejecución ya cambió la orden (idempotente)', async () => {
    prisma.order.findMany.mockResolvedValue([
      { id: 'order-1', items: [{ variantId: 'var-1', quantity: 2 }] },
    ]);
    tx.order.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.releaseExpiredReservations()).resolves.toEqual({
      expired: 1,
      released: 0,
    });
    expect(tx.variant.updateMany).not.toHaveBeenCalled();
  });

  it('omite items sin variante pero igual cancela la orden', async () => {
    prisma.order.findMany.mockResolvedValue([
      { id: 'order-2', items: [{ variantId: null, quantity: 1 }] },
    ]);

    await service.releaseExpiredReservations();

    expect(tx.variant.updateMany).not.toHaveBeenCalled();
    expect(tx.order.updateMany).toHaveBeenCalledTimes(1);
  });

  it('propaga el error de BD (el endpoint debe responder 500)', async () => {
    prisma.order.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.releaseExpiredReservations()).rejects.toThrow('db down');
  });
});

describe('OrderCronService.runInternalCron', () => {
  const prisma = { order: { findMany: vi.fn() }, $transaction: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('no lanza si la base de datos falla', async () => {
    vi.stubEnv('ENABLE_INTERNAL_CRON', 'true');
    prisma.order.findMany.mockRejectedValue(new Error('db down'));
    const service = new OrderCronService(prisma as never);

    await expect(service.runInternalCron()).resolves.toBeUndefined();
  });

  it('no consulta la BD si el cron interno está desactivado', async () => {
    vi.stubEnv('ENABLE_INTERNAL_CRON', 'false');
    const service = new OrderCronService(prisma as never);

    await service.runInternalCron();

    expect(prisma.order.findMany).not.toHaveBeenCalled();
  });
});

describe('internalCronEnabled', () => {
  it.each([
    [{ ENABLE_INTERNAL_CRON: 'true', NODE_ENV: 'production' }, true],
    [{ ENABLE_INTERNAL_CRON: 'false', NODE_ENV: 'development' }, false],
    [{ NODE_ENV: 'production' }, false],
    [{ NODE_ENV: 'development' }, true],
    [{}, true],
  ])('%j → %s', (env, expected) => {
    expect(internalCronEnabled(env as NodeJS.ProcessEnv)).toBe(expected);
  });
});
