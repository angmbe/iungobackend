import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Angelo Bendezu',
      email: 'angelo@demo.com',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Usuario Demo',
      email: 'user@demo.com',
      role: 'USER',
    },
  ];

  findAll(): User[] {
    return this.users;
  }
}

