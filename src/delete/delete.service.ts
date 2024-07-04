import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { ChangeLogDto } from 'src/shared/dto/shared.dto';
import { SharedService } from 'src/shared/shared.service';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class DeleteService {
  constructor(private readonly sharedService: SharedService) {}

  get emp() {
    return JSON.parse(readFileSync(datapath, 'utf-8'));
  }

  deleteAll() {
    try {
      writeFileSync(datapath, '[]');
      return 'All employees deleted';
    } catch (err) {
      console.log(err);
      return new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  deleteId(id: number) {
    try {
      const employees: EmployeeDto[] = this.emp;
      const index = this.sharedService.findEmp(employees, 'empId', id);
      const changeLog: ChangeLogDto[] = this.sharedService.changeLog;
      const change: ChangeLogDto = {
        id: 1,
        empId: id,
        createdAt: Date.now(),
        before: {},
        after: {},
        updatedAt: Date.now(),
      };
      if (changeLog.length !== 0) {
        change.id = changeLog[changeLog.length - 1].id + 1;
      }
      if (index === -1) {
        return 'Id does not exist';
      }
      change.before = employees[index];
      changeLog.push(change);
      employees.splice(index, 1);
      // writeFileSync(datapath, JSON.stringify(employees));
      this.sharedService.emp = employees;
      this.sharedService.changeLog = changeLog;
      return `Employee id ${id} deleted successfuly`;
    } catch (err) {
      console.log(err);
      return new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
