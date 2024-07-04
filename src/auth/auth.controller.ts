import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  authenticateUser(
    @Body(ValidationPipe) loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authenticateUser(loginData, res);
  }
}
