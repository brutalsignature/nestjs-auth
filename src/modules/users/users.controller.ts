import { Controller, Get, Post, Body } from '@nestjs/common';

import { Public } from 'src/decorators/public.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
