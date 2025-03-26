import { Module } from '@nestjs/common'
import { DemoController } from './demo.controller'
import { DemoService } from './demo.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormMysqlDemo } from 'src/database/typeorm-mysql/demo.entity'
import { TypeormSqliteDemo } from 'src/database/typeorm-sqlite/demo.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormMysqlDemo], 'mysql'),
    TypeOrmModule.forFeature([TypeormSqliteDemo], 'sqlite'),
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
