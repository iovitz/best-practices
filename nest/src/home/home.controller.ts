import { Controller, Get, Render } from '@nestjs/common'
import { SkipFormat } from 'src/shared/decorator/skip-format'

@Controller()
export class HomeController {
  @Get()
  @Render('index')
  @SkipFormat()
  getIndex() {
    return {
      message: 'Hello, world!!!',
    }
  }
}
