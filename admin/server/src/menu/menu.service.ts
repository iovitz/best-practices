import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/db/mysql/mysql.service';

@Injectable()
export class MenuService {
  constructor(private mysql: MysqlService) {}
  async getUserMenu() {
    const menu = await this.mysql.menu.findMany();
    const routePidMap = new Map();
    const routes = [];

    menu.forEach((item) => {
      routePidMap.set(item.id, item);
      if (item.pid) {
        const parentRoutes = routePidMap.get(item.pid);
        parentRoutes.children = parentRoutes.children ?? [];
        parentRoutes.children.push(item);
      } else {
        routes.push(item);
      }
      return routes;
    }, {});

    return routes;
  }
}
