import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_LIB_DIR,
  });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  app.enableCors({
  origin: '*', // permitir todos (solo dev)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  });

  // 🔹 Swagger config
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Documentación de servicios backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //await app.listen(process.env.PORT ?? 3000);
  //await app.listen(3002, '0.0.0.0');
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 App corriendo en http://localhost:${port}`);
}
bootstrap();
