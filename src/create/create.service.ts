import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { CreateEmployeeDto } from './dto/create.dto';
import { EmployeeDto } from 'src/read/dto/employee.dto';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class CreateService {
  createEmployee(emp: CreateEmployeeDto): CreateEmployeeDto {
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
        emp.empId = employees[employees.length - 1].empId + 1;
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
