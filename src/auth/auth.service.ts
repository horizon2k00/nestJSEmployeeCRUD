import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from 'src/schemas/employee.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async authenticateUser(
    loginData: LoginDto,
    @Res() res: Response,
  ): Promise<string> {
    const { email, password } = loginData;
    const emp = await this.employeeModel.findOne({ email: email });
    if (!emp) {
      throw new UnauthorizedException('Invalid Email');
    }
    const authorised = await bcrypt.compare(password, emp.password);
    if (authorised) {
      const payload = {
        email,
        audience: 'employee storage',
        privilege: emp.privilege,
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
