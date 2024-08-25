import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/db/mysql/mysql.service';

@Injectable()
export class UserService {
  constructor(private mysql: MysqlService) {}

  getUserList(page: number, take: number) {
    return this.mysql.user.findMany({
      skip: (page - 1) * take,
      take,
    });
  }

  getUserById(id: number) {
    return this.mysql.user.findFirst({
      where: {
        id: '123',
      },
    });
  }

  createUser(name: string, age: number) {
    return this.mysql.user.create({
      data: {
        id: '123',
      },
    });
  }
}
