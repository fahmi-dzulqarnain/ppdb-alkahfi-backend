import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import * as fs from 'fs';

async function bootstrap() {
  const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8');
  const httpsOptions = { key: privateKey, cert: certificate };  
  const app = await NestFactory.create(AppModule, {httpsOptions});

  app.enableCors()
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(3000);
}
bootstrap();
