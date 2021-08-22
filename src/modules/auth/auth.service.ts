import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { UserDocument, User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);

    if (!user || !compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: UserDocument) {
    const payload = { id: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
