import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UtilsService } from './utils/utils.service';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  providers: [PrismaService, UtilsService],
  exports: [PrismaService, UtilsService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env', // 默认配置文件
        process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod', // 环境配置文件
      ],
      load: [
        () => ({
          ...process.env,
          isProd: process.env.NODE_ENV !== 'dev',
          NODE_ENV: process.env.NODE_ENV ?? 'prod',
        }),
      ],
    }),
    LoggerModule,
    EventEmitterModule.forRoot(),
  ],
})
export class CommonModule {}
