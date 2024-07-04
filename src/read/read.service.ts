import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { EmployeeDto } from './dto/employee.dto';
import { SharedService } from '../shared/shared.service';
import { keys } from 'src/shared/dto/shared.dto';

@Injectable()
export class ReadService {
  datapath = join(__dirname, '../../data/data.json');
  constructor(private readonly sharedService: SharedService) {}

  get emp(): EmployeeDto[] {
    return JSON.parse(fs.readFileSync(this.datapath, 'utf-8'));
  }
  findAll(limit: number, page: number): EmployeeDto[] {
    return this.sharedService.paginate(this.emp, limit, page);
  }

  findOne(id: number): EmployeeDto | string {
    const index = this.sharedService.findEmp(this.emp, 'empId', id);
    if (index === -1) {
      return 'Employee not found';
    }
    return this.emp[index];
  }

  getSorted(
    param: keys,
    limit: number | null | undefined,
    page: number | null | undefined,
    order: number | null | undefined,
  ) {
    console.log(param, limit, page, order);

    const emp = this.sharedService.emp;
    if (order !== 1 && order !== -1) {
      order = 1;
    }
    this.sharedService.sortBy(emp, param, order);
    return this.sharedService.paginate(emp, limit, page);
  }

  getByDept(
    dept: 'Frontend' | 'Backend' | 'Fullstack',
    limit: number | null | undefined,
    page: number | null | undefined,
  ) {
    const employees: EmployeeDto[] = this.sharedService.emp;
    const filterArr: EmployeeDto[] = employees.filter(
      (e) => e.department === dept,
    );
    return this.sharedService.paginate(filterArr, limit, page);
  }

  getEmpGt(
    rating: number,
    limit: number | null | undefined,
    page: number | null | undefined,
  ) {
    const emp = this.sharedService.emp;
    const list = emp.filter((ele) => ele.rating >= rating);
    this.sharedService.sortBy(list, 'rating', -1);
    return this.sharedService.paginate(list, limit, page);
  }

  getEmpLt(
    rating: number,
    limit: number | null | undefined,
    page: number | null | undefined,
  ) {
    const emp = this.sharedService.emp;
    const list = emp.filter((ele) => ele.rating <= rating);
    this.sharedService.sortBy(list, 'rating', 1);
    return this.sharedService.paginate(list, limit, page);
  }

  getEmpCount() {
    return this.sharedService.emp.length;
  }

  getDeptCount(dept: 'Frontend' | 'Backend' | 'Fullstack' | string): number {
    const emp = this.sharedService.emp;

    const filterArr = emp.filter((e) => e.department === dept);

    return filterArr.length;
  }
}
