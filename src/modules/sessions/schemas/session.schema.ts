import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from '../../users/schemas/user.schema';

export type SessionDocument = Session & mongoose.Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ required: true })
  fingerprint: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  ip: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
