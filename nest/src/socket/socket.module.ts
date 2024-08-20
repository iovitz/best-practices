import { Module } from '@nestjs/common';
import { SocketV1Module } from './socketv1/socketv1.module';

@Module({
  imports: [SocketV1Module],
})
export class SocketModule {}
