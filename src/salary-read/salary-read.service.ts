import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { SharedService } from 'src/shared/shared.service';
const csvPath = join(__dirname, '../../data/salary-report.csv');

@Injectable()
export class SalaryReadService {
  constructor(private readonly sharedService: SharedService) {}
  downloadReport() {
    const emp = this.sharedService.emp;
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

  getTop(i: number) {
    const emp = this.sharedService.emp;
    if (i > emp.length) {
      i = emp.length;
    }
    this.sharedService.sortBy(emp, 'salary', -1);
    while (i < emp.length && emp[i].salary === emp[i - 1].salary) {
      i++;
    }
    return emp.slice(0, i);
  }

  getSalaryAvg() {
    const emp = this.sharedService.emp;
    const salaryList: number[] = [];
    emp.map((e) => salaryList.push(e.salary));
    return this.sharedService.arrAverage(salaryList)[1].toFixed(2);
  }

  getAllDeptAvg() {
    const emp = this.sharedService.emp;
    const deptObj: { [index: string]: number[] } = {};
    emp.map((e) => {
      deptObj[e.department] = [];
    });
    emp.map((e) => {
      deptObj[e.department].push(e.salary);
    });
    const output: { department: string; total: string; average: string }[] = [];
    Object.keys(deptObj).forEach((key) => {
      const avg: number[] = this.sharedService.arrAverage(deptObj[key]);
      output.push({
        department: key,
        total: avg[0].toFixed(2),
        average: avg[1].toFixed(2),
      });
    });
    return output;
  }

  getAvgBydept(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    const emp = this.sharedService.emp;
    const deptSalList: number[] = [];
    emp
      .filter((e) => e.department === dept)
      .map((e) => deptSalList.push(e.salary));
    const avg: number[] = this.sharedService.arrAverage(deptSalList);
    return `Department: ${dept}\n Total Salary: ${avg[0]}\n Average Salary: ${avg[1]}`;
  }

  getDeptMaxMin(dept: 'Frontend' | 'Backend' | 'Fullstack') {
    const emp = this.sharedService.emp;
    const filterArr = emp.filter((e) => e.department === dept);
    const max: number = this.sharedService.findMax(filterArr, 'salary');
    const min: number = this.sharedService.findMin(filterArr, 'salary');
    return `Department: ${dept}\n Max Salary: ${max}\n Min Salary: ${min}`;
  }
}
