import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import * as fs from 'fs';

async function bootstrap() {
  const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8');
  const httpsOptions = { key: privateKey, cert: certificate };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  // const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(3000);
}
bootstrap();
