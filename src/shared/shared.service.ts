import { Injectable } from '@nestjs/common';
import { EmployeeDto } from 'src/read/dto/employee.dto';

@Injectable()
export class SharedService {
  findEmp(emp: EmployeeDto[], key: string, parameter: string | number): number {
    const index: number = emp.findIndex((e) => e[key] === parameter);
    return index;
  }
}
