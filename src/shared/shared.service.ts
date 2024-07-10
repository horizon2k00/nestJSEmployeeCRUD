import { Injectable } from '@nestjs/common';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SharedService {
  constructor(
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
  ) {}

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
