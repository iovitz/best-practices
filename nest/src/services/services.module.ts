import { Global, Module } from '@nestjs/common';
import { LogService } from './log/log.service';
import { VerifyService } from './verify/verify.service';
import { EncryptService } from './encrypt/encrypt.service';

@Global()
@Module({
  // 全局使用的一些Service
  providers: [EncryptService, VerifyService, LogService],
  exports: [EncryptService, VerifyService, LogService],
})
export class ServicesModule {}
