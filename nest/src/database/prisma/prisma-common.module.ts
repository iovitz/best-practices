import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma.module'
import { PrismaConfigService } from './prisma-config.service'

export const PRISMA_DATABASE = 'PRISMA_DATABASE'

@Module({
  imports: [
    PrismaModule.forRootAsync({
      name: PRISMA_DATABASE,
      useClass: PrismaConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class PrismaCommonModule {}
