import { Controller, Get, Header, Render } from '@nestjs/common'
import { HeaderKeys } from 'src/shared/constans/header'

@Controller()
export class HomeController {
  @Get()
  @Render('index')
  @Header(HeaderKeys.ContentType, 'text/html;charset=urf-8')
  getIndex() {
    return {
      message: 'Hello, world!!!',
    }
  }
}
