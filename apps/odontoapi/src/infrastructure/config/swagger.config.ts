import { DocumentBuilder } from '@nestjs/swagger';

export function buildSwaggerConfig(): ReturnType<DocumentBuilder['build']> {
  return new DocumentBuilder()
    .setTitle('OdontoEhTec API')
    .setDescription('API REST para gestao odontologica')
    .setVersion('1.0.0')
    .build();
}
