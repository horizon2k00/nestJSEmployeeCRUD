import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { CreateEmployeeDto } from './dto/create.dto';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { SharedService } from 'src/shared/shared.service';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class CreateService {
  constructor(private readonly sharedService: SharedService) {}
  createEmployee(emp: CreateEmployeeDto): CreateEmployeeDto {
    const index = this.sharedService.findEmp(
      this.sharedService.emp,
      'email',
      emp.email,
    );
    if (index !== -1) {
      throw new HttpException('User with this email already exists', 400);
    }
    try {
      readFile(datapath, 'utf-8', async (err, data) => {
        if (err) {
          console.log(err);
          throw new HttpException(
            'server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const employees: EmployeeDto[] = JSON.parse(data);
        if (employees.length === 0) {
          emp.empId = 1;
        } else {
          emp.empId = employees[employees.length - 1].empId + 1;
        }
        emp.rating = 40;
        emp.joinDate = Date();
        employees.push(emp);
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
      });
      return emp;
    } catch (err) {
      return err;
    }
  }
}
