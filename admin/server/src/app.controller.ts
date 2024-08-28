import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { SkipFormat } from './shared/decorator/skip-format';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  @SkipFormat()
  getIndex() {
    return {
      message: 'Hello, world!',
    };
  }

  @Post('status')
  getStatus(@Body() body) {
    return body;
  }
}
