import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { ParamsExceptionFilter } from './common/filters/params-exception/params-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter/response-formatter.interceptor';
import { SocketIoAdapter } from './common/adaptors/socket.io.adaptor';
import { RequestTracerInterceptor } from './common/middlewares/request-tracer/request-tracer.middleware';
import { LogService } from './services/log/log.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  });

  const log = app.get(LogService);

  app.useLogger(log);

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, log));

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  });

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new ParamsExceptionFilter(log));
  app.useGlobalFilters(new HttpExceptionFilter(log));
  app.useGlobalInterceptors(new ResponseFormatterInterceptor(log));
  app.useGlobalInterceptors(new RequestTracerInterceptor(log));

  // 允许跨域
  app.enableCors({});

  const appPort = parseInt(configService.getOrThrow('SERVER_PORT')) || 11000;
  await app.listen(appPort);

  log.log(`Server running in http://127.0.0.1:${appPort}`);
}

bootstrap();
