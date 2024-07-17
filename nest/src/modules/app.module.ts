import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [GlobalModule, SocketModule, UserModule],
})
export class AppModule {}
