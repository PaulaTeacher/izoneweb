import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth';
import { CronSecretGuard } from './cron-secret.guard';
import { OrderCronService, ReleaseResult } from './order-cron.service';

/**
 * Endpoints para Cloud Scheduler. No usan JWT de admin (@Public) sino
 * CRON_SECRET; sin throttling y fuera de Swagger.
 */
@ApiExcludeController()
@SkipThrottle({ default: true, checkout: true })
@Public()
@UseGuards(CronSecretGuard)
@Controller('cron')
export class CronController {
  constructor(private readonly orderCron: OrderCronService) {}

  @Post('release-expired')
  @HttpCode(200)
  releaseExpired(): Promise<ReleaseResult> {
    return this.orderCron.releaseExpiredReservations();
  }
}
