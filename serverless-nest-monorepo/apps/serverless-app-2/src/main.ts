import { NestFactory } from '@nestjs/core';
import { ServerlessApp2Module } from './serverless-app-2.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerlessApp2Module);
  await app.listen(3001);
}
bootstrap();
