import 'reflect-metadata';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { JwtAuthGuard, RolesGuard } from '../auth';
import { CronController } from './cron.controller';
import { CRON_SECRET_HEADER, CronSecretGuard, secretsMatch } from './cron-secret.guard';
import { OrderCronService } from './order-cron.service';

const SECRET = 'test-cron-secret-0123456789';

describe('POST /cron/release-expired', () => {
  let app: INestApplication;
  const orderCron = { releaseExpiredReservations: vi.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // Mismos guards globales que AppModule, con un límite bajo para detectar throttling.
      imports: [ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 1 }])],
      controllers: [CronController],
      providers: [
        CronSecretGuard,
        { provide: OrderCronService, useValue: orderCron },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('CRON_SECRET', SECRET);
    orderCron.releaseExpiredReservations.mockResolvedValue({ expired: 1, released: 1 });
  });

  it('sin token → 401 y no libera nada', async () => {
    await request(app.getHttpServer()).post('/cron/release-expired').expect(401);
    expect(orderCron.releaseExpiredReservations).not.toHaveBeenCalled();
  });

  it('con token incorrecto → 401', async () => {
    await request(app.getHttpServer())
      .post('/cron/release-expired')
      .set(CRON_SECRET_HEADER, 'otro-secreto')
      .expect(401);
    expect(orderCron.releaseExpiredReservations).not.toHaveBeenCalled();
  });

  it('un JWT en Authorization no sirve como token de cron', async () => {
    await request(app.getHttpServer())
      .post('/cron/release-expired')
      .set('Authorization', `Bearer ${SECRET}`)
      .expect(401);
  });

  it('con token correcto → 200 y libera (sin JWT ni throttling)', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app.getHttpServer())
        .post('/cron/release-expired')
        .set(CRON_SECRET_HEADER, SECRET)
        .expect(200);
      expect(res.body).toEqual({ expired: 1, released: 1 });
    }
    expect(orderCron.releaseExpiredReservations).toHaveBeenCalledTimes(3);
  });

  it('si CRON_SECRET no está configurado → 503 (cerrado)', async () => {
    vi.stubEnv('CRON_SECRET', '');
    await request(app.getHttpServer())
      .post('/cron/release-expired')
      .set(CRON_SECRET_HEADER, '')
      .expect(503);
    expect(orderCron.releaseExpiredReservations).not.toHaveBeenCalled();
  });

  it('no aparece en la documentación Swagger pública', () => {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    expect(Object.keys(doc.paths).some((p) => p.startsWith('/cron'))).toBe(false);
  });

  it('si la BD falla → 500 (Cloud Scheduler lo registra como fallo)', async () => {
    orderCron.releaseExpiredReservations.mockRejectedValue(new Error('db down'));
    await request(app.getHttpServer())
      .post('/cron/release-expired')
      .set(CRON_SECRET_HEADER, SECRET)
      .expect(500);
  });
});

describe('secretsMatch', () => {
  it('acepta solo el secreto exacto, con cualquier longitud', () => {
    expect(secretsMatch(SECRET, SECRET)).toBe(true);
    expect(secretsMatch(SECRET.slice(0, -1), SECRET)).toBe(false);
    expect(secretsMatch(`${SECRET}x`, SECRET)).toBe(false);
    expect(secretsMatch('', SECRET)).toBe(false);
  });
});
