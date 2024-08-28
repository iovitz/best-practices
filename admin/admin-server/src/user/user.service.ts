import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/db/mysql/mysql.service';

type FindUserProfileParam = Parameters<
  MysqlService['userProfile']['findFirst']
>[0];

@Injectable()
export class UserService {
  constructor(private mysql: MysqlService) {}

  findUserBy(
    where: FindUserProfileParam['where'],
    select: FindUserProfileParam['select'],
  ) {
    return this.mysql.userProfile.findFirst({
      where,
      select,
    });
  }
}
