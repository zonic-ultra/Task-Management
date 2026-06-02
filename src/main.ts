import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
