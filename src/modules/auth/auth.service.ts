import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(
    user: UserDocument,
    fingerprint: string,
    userAgent: string,
    ip: string,
  ) {
    const payload = { id: user._id };

    const refreshToken = uuidv4();

    await this.sessionsService.create({
      userId: user._id,
      refreshToken,
      fingerprint,
      userAgent,
      ip,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async refresh(refreshToken, fingerprint, userAgent, ip) {
    const foundSession = await this.sessionsService.findByRefreshToken(
      fingerprint,
    );

    if (!foundSession || +new Date(foundSession.expiresIn) > +new Date()) {
      throw new UnauthorizedException();
    }

    const newRefreshToken = uuidv4();

    await this.sessionsService.create({
      userId: foundSession.userId,
      refreshToken: newRefreshToken,
      fingerprint,
      userAgent,
      ip,
    });

    return {
      accessToken: this.jwtService.sign({ id: foundSession.userId }),
      refreshToken: newRefreshToken,
    };
  }
}
