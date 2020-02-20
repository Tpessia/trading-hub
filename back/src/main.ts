import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Instanciate App
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.useGlobalFilters(new AllExceptionsFilter());

  // Global Swagger
  const options = new DocumentBuilder()
    .setTitle('Trading Hub')
    .setDescription('Trading Hub')
    .setVersion('1.0')
    // .addTag('data')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    // include: [AppModule]
  });
  SwaggerModule.setup('api', app, document);

  // Start App
  await app.listen(3001);
}

bootstrap();
