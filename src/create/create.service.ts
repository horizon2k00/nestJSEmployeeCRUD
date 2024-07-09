import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create.dto';
import { SharedService } from 'src/shared/shared.service';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { Model } from 'mongoose';

@Injectable()
export class CreateService {
  constructor(
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly sharedService: SharedService,
  ) {}
  async createEmployee(emp: CreateEmployeeDto): Promise<Employee> {
    // const index = this.sharedService.findEmp(
    //   this.sharedService.getemp(),
    //   'email',
    //   emp.email,
    // );
    const overlap = await this.employeeModel.find({ email: emp.email }).exec();
    console.log(overlap);
    if (overlap.length) {
      throw new HttpException('User with this email already exists', 400);
    }
    try {
      console.log('creating...');
      const employees: Employee[] = await this.employeeModel.find().exec();
      console.log(employees);

      if (employees.length === 0) {
        emp.empId = 1;
      } else {
        emp.empId = employees[employees.length - 1].empId + 1;
      }
      emp.rating = 40;
      emp.joinDate = Date.now();
      emp.password = await bcrypt.hash(emp.password, 5);
      const change: ChangeLog = await this.sharedService.createChangeLog(
        emp.empId,
      );
      change.after = emp;
      const newChangeLog =
        await this.changeLogModel.collection.insertOne(change);
      console.log(newChangeLog);
      const createEmp = new this.employeeModel(emp);
      return createEmp.save();
    } catch (err) {
      return err;
    }
  }
}
