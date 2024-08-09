import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { GlobalExceptionFilter } from './aspects/filters/global-exception/global-exception.filter';
import { ParamsExceptionFilter } from './aspects/filters/params-exception/params-exception.filter';
import { HttpExceptionFilter } from './aspects/filters/http-exception/http-exception.filter';
import { ParamsPipe } from './aspects/pipes/params/params.pipe';
import { ResponseFormatterInterceptor } from './aspects/interceptors/response-formatter/response-formatter.interceptor';
import { SocketIoAdapter } from './common/adaptors/socket.io.adaptor';
import { TracerMiddleware } from './aspects/middlewares/tracer/tracer.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  });

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, logger));

  // 虚拟路径为 static
  app.useStaticAssets('public', {
    prefix: '/',
  });

  // 注入Tracer
  app.use(new TracerMiddleware(logger).use);

  app.useGlobalPipes(new ParamsPipe(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalFilters(new ParamsExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseFormatterInterceptor(logger));

  // 允许跨域
  app.enableCors({});

  app.setGlobalPrefix(configService.getOrThrow('API_GLOBAL_PREFIX'));

  const appPort = parseInt(configService.getOrThrow('APP_PORT')) || 11000;
  await app.listen(appPort);

  logger.log(`Server running in http://127.0.0.1:${appPort}`, 'bootstrap');
}

bootstrap();
