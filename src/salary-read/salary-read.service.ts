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

  getSalaryAvg() {
    //figure this out after you finish the mongo link on the rest of the project(aggregations)
    const emp = this.employeeModel.aggregate([
      {
        $group: {
          _id: null,
          users: { $addToSet: '_id' },
          avgSal: { $avg: 'users.salary' },
        },
      },
    ]);
    console.log(emp);
    // const salaryList: number[] = [];
    // emp.map((e) => salaryList.push(e.salary));
    // return this.sharedService.arrAverage(salaryList)[1].toFixed(2);
    return emp;
  }
  //final boss(aggregations)
  getAllDeptAvg() {
    // const emp = this.sharedService.emp;
    // const deptObj: { [index: string]: number[] } = {};
    // emp.map((e) => {
    //   deptObj[e.department] = [];
    // });
    // emp.map((e) => {
    //   deptObj[e.department].push(e.salary);
    // });
    // const output: { department: string; total: string; average: string }[] = [];
    // Object.keys(deptObj).forEach((key) => {
    //   const avg: number[] = this.sharedService.arrAverage(deptObj[key]);
    //   output.push({
    //     department: key,
    //     total: avg[0].toFixed(2),
    //     average: avg[1].toFixed(2),
    //   });
    // });
    // return output;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAvgBydept(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    // const emp = this.sharedService.emp;
    // const deptSalList: number[] = [];
    // emp
    //   .filter((e) => e.department === dept)
    //   .map((e) => deptSalList.push(e.salary));
    // const avg: number[] = this.sharedService.arrAverage(deptSalList);
    // return `Department: ${dept}\n Total Salary: ${avg[0]}\n Average Salary: ${avg[1]}`;
  }

  async getDeptMaxMin(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    // const emp = this.sharedService.emp;
    // const filterArr = emp.filter((e) => e.department === dept);
    const emp = await this.employeeModel
      .find({ department: dept })
      .lean()
      .exec();
    const max: number = this.sharedService.findMax(emp, 'salary');
    const min: number = this.sharedService.findMin(emp, 'salary');
    return `Department: ${dept}\n Max Salary: ${max}\n Min Salary: ${min}`;
  }
}
