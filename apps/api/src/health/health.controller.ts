import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth';

/**
 * Liveness para Cloud Run / balanceadores. No toca la BD a propósito:
 * debe responder rápido aunque Supabase tarde, y no consumir conexiones del pooler.
 */
@ApiExcludeController()
@SkipThrottle({ default: true, checkout: true })
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok'; uptime: number } {
    return { status: 'ok', uptime: Math.round(process.uptime()) };
  }
}
