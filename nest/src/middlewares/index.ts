import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './adaptors/socket.io.adaptor';
import { ResponseFormatInterceptor } from './interceptors/response.interceptor.ts';
import { ValidationPipe } from './pipes/validation.pipe';
import { GlobalErrorFilter } from './filters/error.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ParamsExceptionFilter } from './filters/validator.filter';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export function useMiddlewares(app: NestExpressApplication) {
  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useWebSocketAdapter(new SocketIoAdapter(app, logger));
  app.useGlobalPipes(new ValidationPipe(logger));
  app.useGlobalFilters(new GlobalErrorFilter(logger));
  app.useGlobalFilters(new ParamsExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ResponseFormatInterceptor(logger));
}
