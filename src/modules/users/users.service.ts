import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const created = new this.userModel(dto);
    return created.save();
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
