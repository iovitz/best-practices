import process from 'node:process'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from 'src/services/config/config.service'
import pkg from '../package.json'
import { AppModule } from './app.module'
import { appLogger, formatLogContext } from './services/tracer/tracer'
import { Tracer } from './services/tracer/tracer.service'
import { RcConfig } from './shared/config'

const appTracer = new Tracer('APP')

appTracer.error('Application Running', {
  version: pkg.version,
  env: JSON.stringify(RcConfig),
})

// 防止未捕获异常导致进程退出
process.on('unhandledRejection', (reason: Error) => {
  appTracer.error('### Unhandle Rejection Promise', reason)
})

process.on('uncaughtException', (error) => {
  appTracer.error('### Unhandle Exception', error)
})
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: appTracer,
    abortOnError: false,
  })

  appTracer.log('Application Running', {
    version: pkg.version,
    env: JSON.stringify(RcConfig),
  })

  app.useStaticAssets('public', {
    // 虚拟路径为 static
    prefix: '/static',
  })

  // 配置 EJS 模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  // 允许跨域
  app.enableCors({
    origin: (_, callback) => callback(null, true),
    credentials: true,
  })

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    // .addTag('test')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, swaggerDocument)

  const appPort = RcConfig.APP_PORT
  await app.listen(appPort)

  appTracer.log(`Server running in http://127.0.0.1:${appPort}`)
}

bootstrap().catch((e) => {
  appTracer.error('### APP Exit!!!!', e)
  process.exit(1)
})
