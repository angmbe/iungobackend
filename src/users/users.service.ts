import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly users: UserResponseDto[] = [
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

  findAll(): UserResponseDto[] {
    return this.users;
  }
}
