import {
  Controller,
  Get,
  LoggerService,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { getUserDTO, getUsersDTO } from './user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { Logger } from 'src/common/decorators/logger/logger.decorator';

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
  async createUser(@Logger() logger: LoggerService) {
    logger.debug('创建失败', {
      name: '123123',
    });
    logger.verbose('创建失败', {
      name: '123123',
    });
    logger.log('创建失败', {
      name: '123123',
    });
    logger.warn('创建失败', {
      name: '123123',
    });
    logger.error('创建失败', {
      name: '123123',
    });
    return 'success';
  }
}
