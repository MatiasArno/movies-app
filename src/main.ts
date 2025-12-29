import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LOG_MESSAGES } from './common/constants/log-messages';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log(LOG_MESSAGES.BOOTSTRAP.START);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Movies & Series API')
    .setDescription('API Backend con NestJS, TypeORM y Arquitectura por Capas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`${LOG_MESSAGES.BOOTSTRAP.RUNNING} ${port}`);
  logger.log(LOG_MESSAGES.BOOTSTRAP.SWAGGER);
}
bootstrap();
