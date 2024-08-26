import { Injectable } from '@nestjs/common';
import { nanoid, customAlphabet } from 'nanoid';
import { MysqlService } from 'src/db/mysql/mysql.service';
import { User, UserProfile } from '@prisma/client-mysql';

@Injectable()
export class AuthService {
  constructor(private mysql: MysqlService) {}

  private userIdGenerator = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    9,
  );

  genUserId() {
    return nanoid();
  }

  createUser(
    user: Pick<User, 'email' | 'password'>,
    userProfile: Pick<UserProfile, 'realName' | 'homepath'>,
  ) {
    const id = this.genUserId();
    return this.mysql.$transaction([
      this.mysql.user.create({
        data: {
          id,
          ...user,
        },
      }),
      this.mysql.userProfile.create({
        data: {
          id,
          // 默认昵称为用户名
          username: userProfile.realName,
          ...userProfile,
        },
      }),
    ]);
  }
  genSessionId() {
    return nanoid();
  }
}
