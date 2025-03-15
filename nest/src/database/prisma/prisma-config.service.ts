import { Inject, Injectable } from '@nestjs/common'
import {
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { ConfigService } from 'src/services/config/config.service'

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor(
    @Inject(REQUEST) private request: Request,
    private configService: ConfigService,
  ) {}

  createPrismaModuleOptions():
    | PrismaModuleOptions {
    const headers = this.request.headers
    const tenantId = headers['x-tenant-id'] || 'default'
    if (tenantId === 'prisma1') {
      return {
        url: 'mysql://root:example@localhost:3307/testdb',
      } as PrismaModuleOptions
    }
    else if (tenantId === 'prisma2') {
      return { url: 'postgresql://pguser:example@localhost:5432/testdb' }
    }
    else {
      return { url: this.configService.get('NEST_APP_ENV_PRISMA_MYSQL_CONNECT_URL') }
    }
  }
}
