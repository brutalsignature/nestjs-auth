import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const isExists = await this.userModel.exists({ email: dto.email });

    if (isExists) {
      throw new BadRequestException();
    }

    const password = await hash(dto.password, 10);

    return new this.userModel({ ...dto, password }).save();
  }

  async findOne(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
    // .exec()
    // .then((res) => res.toObject());
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
