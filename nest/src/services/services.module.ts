import { Global, Module, Scope } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { EncryptService } from './encrypt/encrypt.service'
import { HttpService } from './http/http.service'
import { IoService } from './io/io.service'
import { SyncManagerProvider } from './sync-manager/sync-manager.service'
import { RequestTracerProvider } from './tracer/tracer.service'

@Global()
@Module({
  // 全局使用的一些Service
  providers: [ConfigService, EncryptService, HttpService, RequestTracerProvider, IoService, SyncManagerProvider],
  exports: [ConfigService, EncryptService, HttpService, RequestTracerProvider, IoService, SyncManagerProvider],
})
export class ServicesModule {}
