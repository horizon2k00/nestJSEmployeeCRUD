import { Injectable } from '@nestjs/common';
import { NumberKey } from './dto/shared.dto';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SharedService {
  constructor(
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
  ) {}

  // get emp(): EmployeeDto[] {
  //   return JSON.parse(readFileSync(datapath, 'utf-8'));
  // }

  // get changeLog(): ChangeLogDto[] {
  //   return JSON.parse(readFileSync(changepath, 'utf-8'));
  // }

  // set emp(emp: EmployeeDto[]) {
  //   writeFileSync(datapath, JSON.stringify(emp));
  // }
  // set changeLog(changeLog: ChangeLogDto[]) {
  //   writeFileSync(changepath, JSON.stringify(changeLog));
  // }

  // findEmp(emp: EmployeeDto[], key: string, parameter: string | number): number {
  //   const index: number = emp.findIndex((e) => e[key] === parameter);
  //   return index;
  // }
  // sortBy(employees: Employee[], param: keys, order: number | undefined | null) {
  //   employees.sort((a, b) => {
  //     if (order === 1 || order !== -1) {
  //       if (a[param] < b[param]) {
  //         return -1;
  //       } else if (a[param] === b[param]) {
  //         return 0;
  //       } else return 1;
  //     } else {
  //       if (a[param] > b[param]) {
  //         return -1;
  //       } else if (a[param] === b[param]) {
  //         return 0;
  //       } else return 1;
  //     }
  //   });
  // }

  paginate(
    employees: Employee[],
    limit: number | null | undefined,
    page: number | null | undefined,
  ) {
    if (limit) {
      if (limit < 1) {
        limit = 5;
      }
    } else {
      limit = 5;
    }
    if (page) {
      if (page < 1) {
        page = 1;
      }
      if (page * limit > employees.length) {
        page = Math.ceil(employees.length / limit);
      }
    } else {
      page = 1;
    }

    const returnList = employees.slice((page - 1) * limit, page * limit);
    return returnList;
  }
  arrAverage(arr: number[]): number[] {
    let tot: number = 0;
    arr.map((element) => {
      tot += element;
    });
    return [tot, tot / arr.length];
  }
  JSONtoCSV(objArr: { [key: string]: string | number }[]): string {
    let csv = '';
    const headers = Object.keys(objArr[0]);
    csv += headers.join(',') + '\n';
    objArr.map((ele) => {
      const data = headers.map((header) => ele[header]);
      csv += data.join(',') + '\n';
    });
    console.log(csv);
    return csv;
  }
  findMax(emp: Employee[], key: NumberKey): number {
    let max = 0;
    emp.map((e) => {
      if (e[key] > max) max = e[key];
    });
    return max;
  }

  findMin(emp: Employee[], key: NumberKey): number {
    let min = Infinity;
    emp.map((e) => {
      if (e[key] < min) min = e[key];
    });
    return min;
  }

  async createChangeLog(empId: number): Promise<ChangeLog> {
    const changeCount = await this.changeLogModel.collection.countDocuments();
    const change: ChangeLog = {
      updateNo: changeCount + 1,
      empId,
      createdAt: Date.now(),
      before: {},
      after: {},
      updatedAt: Date.now(),
    };
    return change;
  }
}
