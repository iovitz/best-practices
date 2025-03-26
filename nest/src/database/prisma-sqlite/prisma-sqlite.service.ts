import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client-sqlite'
import { ConfigService } from 'src/services/config/config.service'

@Injectable()
export class PrismaSqliteService extends PrismaClient {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super({
      datasourceUrl: configService.get('NEST_APP_ENV_PRISMA_SQLITE_DB_FILE'),
    })
  }
}
