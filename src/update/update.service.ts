import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { UpdateEmployeeDto } from './dto/update-dto';
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
}
