import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WhatsappService, CheckoutRequest } from './whatsapp.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Checkout & WhatsApp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Validar carrito, registrar orden en Supabase y generar enlace de WhatsApp' })
  checkout(@Body() body: CheckoutRequest) {
    return this.whatsappService.generateCheckoutLink(body);
  }

  @Get('coupon/validate')
  @ApiOperation({ summary: 'Verificar cupón y calcular descuento' })
  validateCoupon(
    @Query('code') code: string,
    @Query('subtotal') subtotal: string,
  ) {
    return this.whatsappService.validateCoupon(code, Number(subtotal) || 0);
  }
}
