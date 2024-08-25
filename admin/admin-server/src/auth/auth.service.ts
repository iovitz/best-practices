import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { SqliteService } from 'src/db/sqlite/sqlite.service';

@Injectable()
export class AuthService {
  constructor(private sqliteService: SqliteService) {}

  createUser() {
    return this.sqliteService.$transaction([
      this.sqliteService.user.create({
        data: undefined,
      }),
    ]);
  }
  genSessionId() {
    return nanoid();
  }
}
