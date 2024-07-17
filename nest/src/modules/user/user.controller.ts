import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { createUserDTO, getUserDTO, getUsersDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/list')
  async getUsers(@Query() query: getUsersDTO) {
    const users = await this.userService.getUserList(
      Number(query.page ?? 1),
      Number(query.size ?? 10),
    );
    return users;
  }

  @Get('/:id')
  async getUser(@Param() param: getUserDTO) {
    const user = await this.userService.getUserById(Number(param.id));
    return user;
  }

  @Post('/create')
  async createUser(@Body() body: createUserDTO) {
    const res = await this.userService.createUser(body.name, body.age);
    return res;
  }
}
