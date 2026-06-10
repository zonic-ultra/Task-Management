import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/transform.interceptor';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.enableCors();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();

        throw new BadRequestException({
          // code: ErrorCode.DTO_VALIDATION_ERROR,
          error: 'Bad Request',
          message: messages,
          statusCode: 400,
        });
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 5000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
