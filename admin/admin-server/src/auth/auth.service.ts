import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { MysqlService } from 'src/db/mysql/mysql.service';

@Injectable()
export class AuthService {
  constructor(private mysql: MysqlService) {}

  createUser() {
    return this.mysql.$transaction([
      this.mysql.user.create({
        data: undefined,
      }),
    ]);
  }
  genSessionId() {
    return nanoid();
  }
}
