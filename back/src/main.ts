
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression'; // WARNING: For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
import { AppModule } from './app.module';

async function bootstrap() {
  // Instanciate App
  const app = await NestFactory.create(AppModule);
  
  // Config
  app.setGlobalPrefix('api')
  // app.useGlobalFilters(new AllExceptionsFilter());
  
  // Global Swagger
  const options = new DocumentBuilder()
  .setTitle('Trading Hub')
  .setDescription('Trading Hub')
  .setVersion('1.0')
  // .addTag('data')
  .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  
  // GZIP Compression
  app.use(compression())

  // Start App
  await app.listen(process.env.NODE_ENV === 'production' ? 80 : 3001);
}

bootstrap();
