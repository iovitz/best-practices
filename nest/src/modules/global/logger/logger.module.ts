import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const logLevel = configService.get('LOG_LEVEL');
        const isProd = configService.getOrThrow('isProd');
        const prefix = isProd ? 'PROD' : 'DEV';
        const env = configService.getOrThrow('NODE_ENV');

        const consoleTransport = new transports.Console({
          level: logLevel,
          // 使用时间戳和nest样式
          format: format.combine(
            format.timestamp(),
            utilities.format.nestLike(prefix),
          ),
        });
        const infoTransport = new transports.DailyRotateFile({
          dirname: `logs/${env}/info`,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
          format: format.combine(
            format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            format.printf((i) => {
              return `${i.level} ${[i.timestamp]} ${i.message} ${JSON.stringify(
                i.stack,
              )} ${i.context}`;
            }),
            format.colorize(),
          ),
        });
        const errorTransport = new transports.DailyRotateFile({
          dirname: `logs/${env}/error`,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: format.combine(
            format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            format.printf((i) => {
              return `${i.level} ${[i.timestamp]} ${i.message ?? ''} ${
                i.stack
              } ${i.context}`;
            }),
          ),
        });
        return {
          level: logLevel,
          transports: [consoleTransport, infoTransport, errorTransport],
        };
      },
    }),
  ],
})
export class LoggerModule {}
