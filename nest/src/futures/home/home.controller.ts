import { Controller, Get, Header, Render } from '@nestjs/common'
import { contentType } from 'mime-types'
import { HeaderKeys } from 'src/shared/constans/header'

@Controller()
export class HomeController {
  @Get()
  @Render('index')
  @Header(HeaderKeys.ContentType, contentType('html') as string)
  getIndex() {
    return {
      message: 'Hello, world!!!',
    }
  }
}
