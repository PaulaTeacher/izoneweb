import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('WhatsApp Checkout')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Generar enlace estructurado de WhatsApp' })
  @ApiBody({ schema: { example: { customerName: 'Juan', items: [{ variantId: 'uuid-1', quantity: 1 }] } } })
  generateLink(@Body() body: { items: { variantId: string, quantity: number }[], customerName: string }) {
    return this.whatsappService.generateCheckoutLink(body);
  }
}
