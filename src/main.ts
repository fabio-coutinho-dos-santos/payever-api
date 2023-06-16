import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Payover-Api')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/doc', app, document);
  // app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(Logger);
  await app.listen(3000);
}
bootstrap();
