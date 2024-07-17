import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getUserList(page: number, take: number) {
    return this.prismaService.user.findMany({
      skip: (page - 1) * take,
      take,
    });
  }

  getUserById(id: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  createUser(name: string, age: number) {
    return this.prismaService.user.create({
      data: {
        name,
        age,
      },
    });
  }
}
