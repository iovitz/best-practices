import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Tracer } from 'src/shared/decorator/tracer';
import { TracerService } from 'src/services/tracer/tracer.service';
import { getUserInfoDTO } from './user.dto';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/user-info')
  async getUserInfo(
    @Query() query: getUserInfoDTO,
    @Tracer() tracer: TracerService,
  ) {
    tracer.log('收到请求', {
      ...query,
    });

    return {
      userId: '1',
      username: 'vben',
      realName: 'Vben Admin',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    };
  }
}
