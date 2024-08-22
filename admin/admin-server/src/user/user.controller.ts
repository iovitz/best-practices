import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { getUserDTO, getUsersDTO, createUserDTO } from './user.dto';
import { UserService } from './user.service';
import { Tracer } from 'src/shared/decorator/tracer';
import { TracerService } from 'src/services/tracer/tracer.service';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/list')
  async getUsers(@Query() query: getUsersDTO, @Tracer() tracer: TracerService) {
    const users = await this.userService.getUserList(
      Number(query.page ?? 1),
      Number(query.size ?? 10),
    );
    tracer.warn('警告');
    tracer.error('出错');
    return users;
  }

  @Get('/:id')
  async getUser(@Param() param: getUserDTO) {
    const user = await this.userService.getUserById(Number(param.id));
    return user;
  }

  @Post('/create')
  async createUser(@Body() body: createUserDTO) {
    const user = await this.userService.createUser(body.name, body.age);
    return user;
  }
}
