import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { getUserDTO, getUsersDTO, createUserDTO } from './user.dto';
import { UserService } from './user.service';
import { LogService } from 'src/services/log/log.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private log: LogService,
  ) {}
  @Get('/list')
  async getUsers(@Query() query: getUsersDTO) {
    const users = await this.userService.getUserList(
      Number(query.page ?? 1),
      Number(query.size ?? 10),
    );
    this.log.error('异常', {
      ex: new Error('123'),
    });
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
