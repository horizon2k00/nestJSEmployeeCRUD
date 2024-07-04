import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { writeFile } from 'fs';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { CreateEmployeeDto } from './dto/create.dto';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { SharedService } from 'src/shared/shared.service';
import { ChangeLogDto } from 'src/shared/dto/shared.dto';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class CreateService {
  constructor(private readonly sharedService: SharedService) {}
  async createEmployee(emp: CreateEmployeeDto): Promise<CreateEmployeeDto> {
    const index = this.sharedService.findEmp(
      this.sharedService.emp,
      'email',
      emp.email,
    );
    if (index !== -1) {
      throw new HttpException('User with this email already exists', 400);
    }
    try {
      const employees: EmployeeDto[] = this.sharedService.emp;
      if (employees.length === 0) {
        emp.empId = 1;
      } else {
        emp.empId = employees[employees.length - 1].empId + 1;
      }
      emp.rating = 40;
      emp.joinDate = Date.now();
      emp.password = await bcrypt.hash(emp.password, 5);
      employees.push(emp);
      const changeLog: ChangeLogDto[] = this.sharedService.changeLog;
      const change: ChangeLogDto = {
        id: 1,
        empId: emp.empId,
        createdAt: Date.now(),
        before: {},
        after: {},
        updatedAt: Date.now(),
      };
      if (changeLog.length !== 0) {
        change.id = changeLog[changeLog.length - 1].id + 1;
      }
      change.after = emp;
      changeLog.push(change);
      try {
        writeFile(datapath, JSON.stringify(employees), function (err) {
          if (err) {
            console.log(err);
            throw new HttpException(
              'internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
      this.sharedService.changeLog = changeLog;
      return emp;
    } catch (err) {
      return err;
    }
  }
}
