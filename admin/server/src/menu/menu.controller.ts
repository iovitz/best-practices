import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('api/menu')
export class MenuController {
  constructor(private menu: MenuService) {}
  @Get('list')
  async getMenu() {
    const menu = await this.menu.getVisibleMenu();
    return menu;
  }
}
