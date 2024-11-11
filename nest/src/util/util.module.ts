import { Global, Module } from '@nestjs/common'
import { EncryptService } from './encrypt/encrypt.service'
import { HttpService } from './http/http.service'
import { TracerService } from './tracer/tracer.service'

@Module({
  // 全局使用的一些Service
  providers: [EncryptService, TracerService, HttpService],
  exports: [EncryptService, TracerService, HttpService],
})
export class UtilModule {}
