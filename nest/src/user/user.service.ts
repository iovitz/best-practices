import type { SqliteService } from '../db/sqlite/sqlite.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(private prismaService: SqliteService) {}

  getUserList(page: number, take: number) {
    return this.prismaService.user.findMany({
      skip: (page - 1) * take,
      take,
    })
  }

  getUserById(id: number) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
    })
  }

  createUser(name: string, age: number) {
    return this.prismaService.user.create({
      data: {
        name,
        age,
      },
    })
  }
}
