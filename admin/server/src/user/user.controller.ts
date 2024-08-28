import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { getUserInfoDTO } from './user.dto';
import { VerifyPipe } from 'src/aspects/pipes/verify/verify.pipe';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserInfo(@Param(VerifyPipe) param: getUserInfoDTO) {
    const res = await this.userService.findUserBy(
      {
        id: param.id,
      },
      {
        username: true,
        realName: true,
        avatar: true,
        desc: true,
        homepath: true,
      },
    );
    return {
      userId: '1',
      username: res.username,
      realName: res.realName,
      avatar: res.avatar,
      desc: res.desc,
      homePath: res.homepath,
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    };
  }
}
