import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client-mysql'
import { ConfigService } from 'src/services/config/config.service'

@Injectable()
export class PrismaMysqlService extends PrismaClient {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super({
      datasourceUrl: configService.get('NEST_APP_ENV_PRISMA_MYSQL_CONNECT_URL'),
    })
  }
}
