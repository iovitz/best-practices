import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { ParamsExceptionFilter } from './common/filters/params-exception/params-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ParamsPipe } from './common/pipes/params/params.pipe';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter/response-formatter.interceptor';
import { SocketIoAdapter } from './common/adaptors/socket.io.adaptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  });

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, logger));

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  });

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ParamsPipe(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalFilters(new ParamsExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseFormatterInterceptor(logger));

  // 允许跨域
  app.enableCors({});

  const appPort = parseInt(configService.getOrThrow('SERVER_PORT')) || 11000;
  await app.listen(appPort);

  logger.log(`Server running in http://127.0.0.1:${appPort}`, 'bootstrap');
}

bootstrap();
