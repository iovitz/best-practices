import { Module } from '@nestjs/common'
import { DemoModule } from './demo/demo.module'
import { HomeModule } from './home/home.module'

@Module({
  imports: [
    HomeModule,
    DemoModule,
  ],
})
export class FuturesModule {}
