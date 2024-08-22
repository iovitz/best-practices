import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './common/adaptors/socket.io.adaptor';
import { LogService } from './services/log/log.service';
import * as pkg from '../package.json';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  });

  const rootLogger = app.get(LogService);
  const config = app.get(ConfigService);

  const log = rootLogger.child({
    msgPrefix: 'APP',
  });

  log.log('APP START', {
    version: pkg.version,
  });

  app.useLogger(log);

  app.use(
    session({
      secret: config.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, log));

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  });

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  // 允许跨域
  app.enableCors({});

  const appPort = parseInt(configService.getOrThrow('SERVER_PORT')) || 11000;
  await app.listen(appPort);

  log.log(`Server running in http://127.0.0.1:${appPort}`);
}

bootstrap();
