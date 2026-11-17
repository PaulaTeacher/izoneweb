import dns from 'node:dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

// Supabase pooler often hangs ~2–3s on IPv6 before falling back to IPv4.
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ======================== SECURITY HEADERS ========================
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // ======================== CORS ========================
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24h preflight cache
  });

  // ======================== VALIDATION ========================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ======================== SWAGGER ========================
  const config = new DocumentBuilder()
    .setTitle('iZone Tech API')
    .setDescription(
      'API backend para iZone Tech — E-commerce de productos Apple & tecnología premium. Bogotá, Colombia.',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación y gestión de sesiones')
    .addTag('Catalog', 'Catálogo de productos, categorías y marcas')
    .addTag('Checkout & WhatsApp', 'Checkout vía WhatsApp y gestión de órdenes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 iZone Tech API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
