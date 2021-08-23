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

  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user, req.cookies['refreshToken']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
