import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './aspects/adaptors/socket.io.adaptor';
import * as pkg from '../package.json';
import * as session from 'express-session';
import { TracerService } from './services/tracer/tracer.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  });

  const rootTracer = app.get(TracerService);
  const config = app.get(ConfigService);

  const appTracer = rootTracer.child('APP');

  app.useLogger(appTracer);

  appTracer.log('Application Running', {
    version: pkg.version,
  });

  app.use(
    session({
      name: '__ss',
      secret: config.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoAdapter(app, appTracer));

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  });

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  // 允许跨域
  // app.enableCors({});

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    // .addTag('test')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, swaggerDocument);

  const appPort = parseInt(configService.getOrThrow('SERVER_PORT')) || 11000;
  await app.listen(appPort);

  appTracer.log(`Server running in http://127.0.0.1:${appPort}`);
}

bootstrap();
