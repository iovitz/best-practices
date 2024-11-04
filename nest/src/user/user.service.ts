import { Injectable } from '@nestjs/common'
import { SqliteService } from '../db/sqlite/sqlite.service'

@Injectable()
export class UserService {
  constructor(private sqliteService: SqliteService) {}

  getUserList(page: number, take: number) {
    return this.sqliteService.user.findMany({
      skip: (page - 1) * take,
      take,
    })
  }

  getUserById(id: number) {
    return this.sqliteService.user.findFirst({
      where: {
        id,
      },
    })
  }

  createUser(name: string, age: number) {
    return this.sqliteService.user.create({
      data: {
        name,
        age,
      },
    })
  }
}
