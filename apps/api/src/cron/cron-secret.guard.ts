import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';

export const CRON_SECRET_HEADER = 'x-cron-secret';

/** Compara en tiempo constante (hash previo para igualar longitudes). */
export function secretsMatch(provided: string, expected: string): boolean {
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Protege los endpoints de cron: exige la cabecera `X-Cron-Secret` igual a CRON_SECRET.
 * Sin CRON_SECRET configurado, el endpoint queda cerrado (503).
 */
@Injectable()
export class CronSecretGuard implements CanActivate {
  private readonly logger = new Logger(CronSecretGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.CRON_SECRET?.trim();
    if (!expected) {
      this.logger.warn('CRON_SECRET no está configurado: endpoint de cron deshabilitado');
      throw new ServiceUnavailableException('Cron no configurado');
    }

    const req = context.switchToHttp().getRequest<{ headers: Record<string, unknown> }>();
    const provided = req.headers[CRON_SECRET_HEADER];
    if (typeof provided !== 'string' || !provided || !secretsMatch(provided, expected)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
