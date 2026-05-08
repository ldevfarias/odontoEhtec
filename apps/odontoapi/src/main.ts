import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { buildSwaggerConfig } from './infrastructure/config/swagger.config';
import { validateEnv } from './infrastructure/config/env.validation';

async function bootstrap(): Promise<void> {
  validateEnv(process.env);

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix('api');
  app.enableCors();

  const swaggerDocument = SwaggerModule.createDocument(app, buildSwaggerConfig());
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env['PORT'] ?? 3333;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger available on http://localhost:${port}/api/docs`);
}

void bootstrap();
