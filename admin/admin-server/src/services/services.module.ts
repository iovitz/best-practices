import { Global, Module } from '@nestjs/common';
import { VerifyService } from './verify/verify.service';
import { EncryptService } from './encrypt/encrypt.service';
import { TracerService } from './tracer/tracer.service';

@Global()
@Module({
  // 全局使用的一些Service
  providers: [EncryptService, VerifyService, TracerService],
  exports: [EncryptService, VerifyService, TracerService],
})
export class ServicesModule {}
