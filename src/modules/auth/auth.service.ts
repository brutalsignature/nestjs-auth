import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { UserDocument, User } from '../users/schemas/user.schema';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);

    if (!user || !compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(
    user: UserDocument,
    refreshToken,
    fingerprint,
    userAgent: string,
    ip: string,
  ) {
    await this.sessionsService.create({
      userId: user._id,
      refreshToken: 'elgfegf',
      fingerprint,
      userAgent,
      ip,
    });

    const payload = { id: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
