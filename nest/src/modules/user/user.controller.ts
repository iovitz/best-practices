import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { createUserDTO, getUserDTO, getUsersDTO } from './user.dto';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/list')
  async getUsers(@Query() query: getUsersDTO, @Req() req: Request) {
    const users = await this.userService.getUserList(
      Number(query.page ?? 1),
      Number(query.size ?? 10),
    );
    req.user;
    return users;
  }

  @Get('/:id')
  async getUser(@Param() param: getUserDTO) {
    const user = await this.userService.getUserById(Number(param.id));
    return user;
  }

  @Post('/create')
  async createUser() {
    return 'success';
  }
}
