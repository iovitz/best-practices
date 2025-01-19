import { Global, Module, Scope } from '@nestjs/common'
import { EncryptService } from './encrypt/encrypt.service'
import { HttpService } from './http/http.service'
import { IoService } from './io/io.service'
import { RequestTracerProvider, TracerService } from './tracer/tracer.service'

@Global()
@Module({
  // 全局使用的一些Service
  providers: [EncryptService, HttpService, TracerService, RequestTracerProvider, IoService],
  exports: [EncryptService, HttpService, TracerService, RequestTracerProvider, IoService],
})
export class UtilModule {}
