import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { useMiddlewares } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  // 虚拟路径为 static
  app.useStaticAssets('public', {
    prefix: '/',
  });

  useMiddlewares(app);

  // DEVELOP情况下允许跨院
  app.enableCors({
    origin: ['127.0.0.1:5173'],
  });

  app.setGlobalPrefix(configService.get('API_GLOBAL_PREFIX'));
  const appPort = parseInt(configService.get('APP_PORT')) || 11000;
  await app.listen(appPort);
  logger.log(`Server running in http://127.0.0.1:${appPort}`, 'bootstrap');
}

bootstrap();
