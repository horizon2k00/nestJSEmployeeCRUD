import { Injectable, UnauthorizedException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AuthRequest, UpdateEmployeeDto } from './dto/update-dto';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { SharedService } from 'src/shared/shared.service';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class UpdateService {
  constructor(private readonly sharedService: SharedService) {}
  get emp(): EmployeeDto[] {
    return JSON.parse(readFileSync(datapath, 'utf-8'));
  }
  updateId(id: number, data: UpdateEmployeeDto): void {
    const employees: EmployeeDto[] = this.emp;
    const index = this.sharedService.findEmp(employees, 'empId', id);
    console.log('updating');
    if (data.name) {
      employees[index].name = data.name;
    }
    if (data.age) {
      employees[index].age = data.age;
    }
    if (data.position) {
      employees[index].position = data.position;
    }
    if (data.department) {
      employees[index].department = data.department;
    }
    if (data.salary) {
      employees[index].salary = data.salary;
    }
    if (data.privilege) {
      employees[index].privilege = data.privilege;
    }
    if (data.rating) {
      employees[index].rating = data.rating;
    }
    writeFileSync(datapath, JSON.stringify(employees));
  }

  updatePassword(
    req: AuthRequest,
    oldPassword: string,
    password: string,
  ): string {
    const emp = this.sharedService.emp;
    if (req.payload) {
      const email = req.payload.email;
      const index = this.sharedService.findEmp(emp, 'email', email);
      if (index === -1) {
        throw new UnauthorizedException('Email does not exist');
      }
      if (emp[index].password === oldPassword) {
        emp[index].password = password;
        writeFileSync(datapath, JSON.stringify(emp));
        return 'Password updated successfully';
      } else {
        return 'Old password is incorrect';
      }
    } else {
      throw new UnauthorizedException('Access token invalid');
    }
  }
}
