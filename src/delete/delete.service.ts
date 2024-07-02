import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { EmployeeDto } from 'src/read/dto/employee.dto';
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
      if (index === -1) {
        return 'Id does not exist';
      }
      employees.splice(index, 1);
      writeFileSync(datapath, JSON.stringify(employees));
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
