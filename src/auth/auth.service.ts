import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SharedService } from 'src/shared/shared.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private sharedService: SharedService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  datapath = join(__dirname, '../../data/data.json');

  get emp(): EmployeeDto[] {
    return JSON.parse(readFileSync(this.datapath, 'utf-8'));
  }

  authenticateUser(loginData: LoginDto, @Res() res: Response): string {
    const { email, password } = loginData;
    const index = this.sharedService.findEmp(this.emp, 'email', email);
    if (index === -1) {
      throw new UnauthorizedException('Invalid Email');
    } else if (this.emp[index].password === password) {
      const payload = {
        email,
        audience: 'employee storage',
        privilege: this.emp[index].privilege,
      };
      console.log(this.configService.get('SECRET_KEY'));
      const jwt = this.jwtService.sign(payload);
      res.append('access_token', jwt);
      return 'Successfully Logged in';
    } else {
      console.log('Wrong pass');
      throw new UnauthorizedException('Incorrect password');
    }
  }
}
