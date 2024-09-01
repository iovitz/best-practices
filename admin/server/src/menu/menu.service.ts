import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/db/mysql/mysql.service';
import { MenuItem } from './menu.types';

type FindMenuParams = Parameters<MysqlService['menu']['findFirst']>[0];

@Injectable()
export class MenuService {
  constructor(private mysql: MysqlService) {}
  findMenyBy(
    where: FindMenuParams['where'],
    select?: FindMenuParams['select'],
  ) {
    return this.mysql.menu.findMany({
      where,
      select,
    });
  }

  async getVisibleMenu() {
    const menuList = await this.findMenyBy({
      status: false,
    });
    const routePidMap = new Map<number, MenuItem>();
    const routes: MenuItem[] = [];

    menuList.forEach((item) => {
      const routeItem = {
        path: item.path,
        name: item.name,
        children: [],
        meta: {
          title: item.title,
          icon: item.icon,
          rank: item.rank,
          roles: item.roles ? JSON.parse(item.roles) : void 0,
          auths: item.auth ? JSON.parse(item.auth) : void 0,
        },
      };
      routePidMap.set(item.id, routeItem);
      if (item.pid === 0) {
        routes.push(routeItem);
      } else {
        const parentRoutes = routePidMap.get(item.pid);
        parentRoutes.children = parentRoutes.children;
        parentRoutes.children.push(routeItem);
      }
    });

    return routes;
  }
}
