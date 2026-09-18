import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CheckoutRequestDto } from './dto/checkout.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators';

@ApiTags('Checkout & WhatsApp')
@Controller('whatsapp')
@Public()
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Validar carrito, reservar stock, registrar orden y generar enlace de WhatsApp' })
  checkout(@Body() body: CheckoutRequestDto) {
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
