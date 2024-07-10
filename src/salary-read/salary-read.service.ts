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
    const emp = await this.employeeModel.find().lean().exec();
    const deptObj: { [index: string]: number[] } = {};
    emp.map((e) => {
      deptObj[e.department] = [];
    });
    emp.map((e) => {
      deptObj[e.department].push(e.salary);
    });
    const output: { [key: string]: string | number }[] = [];
    Object.keys(deptObj).forEach((key) => {
      const avg: number[] = this.sharedService.arrAverage(deptObj[key]);
      output.push({
        department: key,
        totalSalaryExpenditure: avg[0],
        deptAvg: avg[1].toFixed(2),
      });
    });
    const csvData: string = this.sharedService.JSONtoCSV(output);
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
    ]);
    console.log(emp);
    return emp[0].avgSal.toFixed(2);
  }
  //final boss(aggregations)
  async getAllDeptAvg() {
    const emp = await this.employeeModel.aggregate([
      { $group: { _id: '$department', avgSal: { $avg: '$salary' } } },
      { $sort: { avgSal: -1 } },
    ]);
    console.log(emp);
    return emp;
  }

  async getAvgBydept(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    const emp = await this.employeeModel.aggregate([
      { $match: { department: dept } },
      { $group: { _id: '$department', avgSal: { $avg: '$salary' } } },
      { $sort: { avgSal: -1 } },
    ]);
    console.log(emp);
    return emp;
  }

  async getDeptMaxMin(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    //   const emp = await this.employeeModel
    //     .find({ department: dept })
    //     .lean()
    //     .exec();
    //   const max: number = this.sharedService.findMax(emp, 'salary');
    //   const min: number = this.sharedService.findMin(emp, 'salary');
    //   return `Department: ${dept}\n Max Salary: ${max}\n Min Salary: ${min}`;
    // }
    const list = await this.employeeModel.aggregate([
      { $match: { department: dept } },
      {
        $group: {
          _id: null,
          maxSal: { $max: '$salary' },
          minSal: { $min: '$salary' },
        },
      },
    ]);
    console.log(list);
    return list;
  }
}
