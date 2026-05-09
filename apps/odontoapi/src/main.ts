import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { validateEnv } from './infrastructure/config/env.validation';
import { buildSwaggerConfig } from './infrastructure/config/swagger.config';

async function bootstrap(): Promise<void> {
  validateEnv(process.env);

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    })
  );

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix('api');

  // Same-domain deployment: SameSite=Strict cookies make wide CORS unnecessary
  app.enableCors({
    origin: process.env['ALLOWED_ORIGIN'] ?? 'http://localhost:3000',
    credentials: true,
  });

  const swaggerDocument = SwaggerModule.createDocument(app, buildSwaggerConfig());
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env['PORT'] ?? 3333;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger available on http://localhost:${port}/api/docs`);
}

void bootstrap();
