import { Controller, Get, Render } from '@nestjs/common';
import { SkipFormat } from './common/decorator/skip-format';

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
}
