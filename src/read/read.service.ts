import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { EmployeeDto } from './dto/employee.dto';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class ReadService {
  datapath = join(__dirname, '../../data/data.json');
  constructor(private readonly sharedService: SharedService) {}

  get emp(): EmployeeDto[] {
    return JSON.parse(fs.readFileSync(this.datapath, 'utf-8'));
  }
  findAll(): EmployeeDto[] {
    return this.emp;
  }

  findOne(id: number): EmployeeDto | string {
    const index = this.sharedService.findEmp(this.emp, 'empId', id);
    if (index === -1) {
      return 'Employee not found';
    }
    return this.emp[index];
  }
}
