import { Controller, Get, Header, Render, Res } from '@nestjs/common'
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

  @Get('stream')
  streamTemplate(@Res() res: Res) {
    res.setHeader('Content-Type', 'text/html')

    // 第一部分
    res.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Streamed Page</title>
      </head>
      <body>
        <h1>Header</h1>
    `)

    // 第二部分（延迟发送）
    setTimeout(() => {
      res.write(`
        <h1>Main</h1>
      `)
    }, 1000)

    // 第三部分（结束）
    setTimeout(() => {
      res.write(`
        <h1>Footer</h1>
      </body>
      </html>
      `)
      res.end()
    }, 2000)
  }
}
