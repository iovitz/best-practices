import * as process from 'node:process'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as pkg from '../package.json'
import { AppModule } from './app.module'
import { appLogger, formatLogContext } from './util/tracer/tracer'
import { TracerService } from './util/tracer/tracer.service'

// 防止未捕获异常导致进程退出
process.on('unhandledRejection', (reason: Error) => {
  appLogger.error('###Unhandle Rejection Promise', formatLogContext(reason))
})

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 先不打印日志，放入缓冲区，直到指定了Logger才进行打印
    bufferLogs: true,
  })

  const rootTracer = app.get(TracerService)

  const appTracer = rootTracer.child('APP')

  app.useLogger(appTracer)

  appTracer.log('Application Running', {
    version: pkg.version,
  })

  const configService = app.get(ConfigService)

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  })

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  // 允许跨域
  // app.enableCors({});

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    // .addTag('test')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, swaggerDocument)

  const appPort = Number.parseInt(configService.getOrThrow('APP_NAME_PORT'))
  await app.listen(appPort)

  appTracer.log(`Server running in http://127.0.0.1:${appPort}`)
}

bootstrap()
