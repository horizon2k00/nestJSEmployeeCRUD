import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Employee } from 'src/schemas/employee.schema';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.get('Authorization');
    if (!token) {
      throw new UnauthorizedException('You are not logged in');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_KEY'),
      });
      request['payload'] = payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Token invalid');
    }
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.payload.privilege === 'Admin') {
      return true;
    } else {
      throw new UnauthorizedException('Admin privilege needed');
    }
  }
}

@Injectable()
export class IsAuthorisedGuard implements CanActivate {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly sharedService: SharedService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id);
    const findEmpMail = await this.employeeModel
      .find({
        email: request.payload.email,
      })
      .lean()
      .exec();
    if (findEmpMail.length === 0) {
      console.log(findEmpMail);
      throw new UnauthorizedException('Bad token');
    }
    const findEmpId = this.employeeModel.find({ empId: id });
    if ((await findEmpId).length) {
      return true;
    }
    if (request.payload.privilege === 'Admin') {
      return true;
    }
    return false;
  }
}
