import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
  Ip,
  Headers,
} from '@nestjs/common';

import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body, @Headers() headers, @Ip() ip) {
    return this.authService.login(
      req.user,
      'dflgfdh',
      body.fingerprint,
      headers['user-agent'],
      ip,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
