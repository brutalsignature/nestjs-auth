import {
  Controller,
  Post,
  Get,
  Request,
  Response,
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
  async login(
    @Request() req,
    @Response({ passthrough: true }) res,
    @Body() body,
    @Headers() headers,
    @Ip() ip,
  ) {
    const response = await this.authService.login(
      req.user,
      body.fingerprint,
      headers['user-agent'],
      ip,
    );

    res.cookie('refreshToken', response.refreshToken);

    return response;
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Request() req,
    @Response({ passthrough: true }) res,
    @Body() body,
    @Headers() headers,
    @Ip() ip,
  ) {
    const response = await this.authService.refresh(
      req.cookies['refreshToken'],
      body.fingerprint,
      headers['user-agent'],
      ip,
    );

    res.cookie('refreshToken', response.refreshToken);

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    // Почему тут различается юзер с контроллером логина?
    return req.user;
  }
}
