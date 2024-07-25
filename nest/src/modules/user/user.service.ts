import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  getUserList(page: number, take: number) {
    return 1;
  }

  getUserById(id: number) {
    return 2;
  }

  createUser(name: string, age: number) {
    return 3;
  }
}
