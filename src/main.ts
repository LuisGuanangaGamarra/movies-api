import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/infra/filters/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  expressApp.set(
    'trust proxy',
    process.env.NODE_ENV === 'production' ? 1 : false,
  );
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('DDD + Clean Code + RBAC (DB), JWT con rol, SWAPI API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT en el formato: Bearer <token>',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
