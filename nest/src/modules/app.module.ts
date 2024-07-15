import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [GlobalModule, SocketModule],
})
export class AppModule {}
