import { Module } from '@nestjs/common'
import { DemoController } from './demo.controller'
import { DemoService } from './demo.service'
import { TypeormMysqlDemo } from 'src/database/typeorm/mysql/demo.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormMysqlDemo]),
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
