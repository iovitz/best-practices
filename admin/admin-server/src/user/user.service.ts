import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/db/mysql/mysql.service';
import { User } from '@prisma/client-mysql';

@Injectable()
export class UserService {
  constructor(private mysql: MysqlService) {}

  getUserList(page: number, take: number) {
    return this.mysql.user.findMany({
      skip: (page - 1) * take,
      take,
    });
  }

  getUserById(id: string) {
    return this.mysql.user.findFirst({
      where: {
        id,
      },
    });
  }

  createUser(data: User) {
    return this.mysql.user.create({
      data,
    });
  }
}
