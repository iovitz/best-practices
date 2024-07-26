import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as chalk from 'chalk';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const logLevel = configService.get('LOG_LEVEL');
        const env = configService.getOrThrow('NODE_ENV');

        const consoleTransport = new transports.Console({
          level: logLevel,
          // 使用时间戳和nest样式
          format: format.combine(
            format.timestamp({ format: 'MM-DD HH:mm:ss' }),
            format.printf((i) => {
              const timestamp = chalk.gray(i.timestamp);
              const message = chalk.blue(i.message);
              return `${[timestamp]} ${i.level} ${message} ${i.context ?? ''} ${
                i.stack ?? ''
              }`;
            }),
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
              return `${[i.timestamp]} ${i.level} ${i.context}  ${i.message} ${JSON.stringify(
                i.stack,
              )}`;
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
