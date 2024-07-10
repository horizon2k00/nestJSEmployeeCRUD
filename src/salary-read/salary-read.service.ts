import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { writeFileSync } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { Employee } from 'src/schemas/employee.schema';
import { SharedService } from 'src/shared/shared.service';
const csvPath = join(__dirname, '../../data/salary-report.csv');

@Injectable()
export class SalaryReadService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly sharedService: SharedService,
  ) {}
  async downloadReport() {
    const list = await this.employeeModel.aggregate([
      {
        $group: {
          _id: '$department',
          department: { $first: '$department' }, //to send 'department' as key to hold the dept name instead of '_id' and to make it the first entry in the object for convenience of user
          totalSalaryExpenditure: { $sum: '$salary' },
          deptAvg: { $avg: '$salary' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    const csvData: string = this.sharedService.JSONtoCSV(list);
    writeFileSync(csvPath, csvData);
    return csvPath;
  }

  async getTop(i: number): Promise<Employee[]> {
    const emp = await this.employeeModel.find({}).sort({ salary: -1 }).limit(i);
    return emp;
  }

  async getSalaryAvg() {
    const emp = await this.employeeModel.aggregate([
      {
        $group: {
          _id: null,
          avgSal: { $avg: '$salary' },
        },
      },
      { $project: { _id: 0, avgSalRound: { $round: ['$avgSal', 2] } } },
    ]);
    console.log(emp);
    return emp;
  }

  async getAllDeptAvg() {
    const emp = await this.employeeModel.aggregate([
      { $group: { _id: '$department', avgSal: { $avg: '$salary' } } },
      { $sort: { avgSal: -1 } },
      { $project: { _id: 1, avgSal: { $round: ['$avgSal', 2] } } },
    ]);
    console.log(emp);
    return emp;
  }

  async getAvgBydept(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    const emp = await this.employeeModel.aggregate([
      { $match: { department: dept } },
      { $group: { _id: '$department', avgSal: { $avg: '$salary' } } },
      { $sort: { avgSal: -1 } },
      { $project: { _id: 1, avgSal: { $round: ['$avgSal', 2] } } },
    ]);
    console.log(emp);
    return emp;
  }

  async getDeptMaxMin(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    const list = await this.employeeModel.aggregate([
      { $match: { department: dept } },
      {
        $group: {
          _id: '$department',
          maxSal: { $max: '$salary' },
          minSal: { $min: '$salary' },
        },
      },
      { $project: { _id: 1, maxSal: 1, minSal: 1 } },
    ]);
    console.log(list);
    return list;
  }
}
