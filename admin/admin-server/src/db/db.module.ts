import { Global, Module } from '@nestjs/common';
import { MysqlService } from './mysql/mysql.service';

@Global()
@Module({
  providers: [MysqlService],
  exports: [MysqlService],
})
export class DbModule {}
