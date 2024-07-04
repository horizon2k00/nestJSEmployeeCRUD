import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
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
  constructor(private readonly sharedService: SharedService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id);
    const index = this.sharedService.findEmp(
      this.sharedService.emp,
      'email',
      request.payload.email,
    );
    if (index === -1) {
      throw new UnauthorizedException('Bad token');
    }
    if (this.sharedService.emp[index].empId === id) {
      return true;
    }
    if (request.payload.privilege === 'Admin') {
      return true;
    }
    return false;
  }
}
