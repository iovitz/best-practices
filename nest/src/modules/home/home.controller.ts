import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';

@Controller('home')
export class HomeController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  async getHome() {
    await this.prismaService.user.create({
      data: {
        name: 'zhagnsan',
        email: 'zhangsan@qq.com',
      },
    });
    return 'OK';
  }
}
