import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client-mysql';
import { TracerService } from 'src/services/tracer/tracer.service';

@Injectable()
export class MysqlService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(private tracer: TracerService) {
    super();
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.tracer.log('数据库链接成功');
    } catch (e) {
      this.tracer.error('数据库链接失败', e);
    }
  }

  async onApplicationShutdown() {
    this.$disconnect();
  }
}
