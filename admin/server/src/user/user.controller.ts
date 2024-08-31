import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { getUserInfoDTO } from './user.dto';
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id(\\w{10})')
  async getInfo(@Param(VerifyPipe) param: getUserInfoDTO) {
    const res = await this.userService.findUserBy(
      {
        id: param.id,
      },
      {
        username: true,
        avatar: true,
        desc: true,
      },
    );
    if (!res) {
      throw new BadRequestException('用户不存在');
    }
    return {
      userId: '1',
      username: res.username,
      avatar: res.avatar,
      desc: res.desc,
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    };
  }

  @Get('routes')
  async getRoutes() {
    return [
      {
        path: '/permission',
        meta: {
          title: '权限管理',
          icon: 'ep:lollipop',
          rank: 10,
        },
        children: [
          {
            path: '/permission/page/index',
            name: 'PermissionPage',
            meta: {
              title: '页面权限',
              roles: ['admin', 'common'],
            },
          },
          {
            path: '/permission/button',
            meta: {
              title: '按钮权限',
              roles: ['admin', 'common'],
            },
            children: [
              {
                path: '/permission/button/router',
                component: 'permission/button/index',
                name: 'PermissionButtonRouter',
                meta: {
                  title: '路由返回按钮权限',
                  auths: [
                    'permission:btn:add',
                    'permission:btn:edit',
                    'permission:btn:delete',
                  ],
                },
              },
              {
                path: '/permission/button/login',
                component: 'permission/button/perms',
                name: 'PermissionButtonLogin',
                meta: {
                  title: '登录接口返回按钮权限',
                },
              },
            ],
          },
        ],
      },
    ];
  }
}
