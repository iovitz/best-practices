import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { SocketModule } from './socket/socket.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [GlobalModule, SocketModule, HomeModule],
})
export class AppModule {}