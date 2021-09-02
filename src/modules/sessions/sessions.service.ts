import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async create(dto: CreateSessionDto): Promise<Session> {
    const expiresIn = +new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return new this.sessionModel({ ...dto, expiresIn }).save();
  }

  async findByRefreshToken(refreshToken: string): Promise<Session> {
    return this.sessionModel.findOneAndDelete({ refreshToken });
  }
}
