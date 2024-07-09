import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRequest } from './dto/update-dto';
import { SharedService } from 'src/shared/shared.service';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { Model } from 'mongoose';

@Injectable()
export class UpdateService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
    private readonly sharedService: SharedService,
  ) {}
  // updateId(id: number, data: UpdateEmployeeDto): void {
  //   const employees: EmployeeDto[] = this.sharedService.emp;
  //   const changeLog: ChangeLogDto[] = this.sharedService.changeLog;
  //   const change: ChangeLogDto = {
  //     updateNo: 1,
  //     empId: id,
  //     createdAt: Date.now(),
  //     before: {},
  //     after: {},
  //     updatedAt: 0,
  //   };
  //   if (changeLog.length !== 0) {
  //     change.updateNo = changeLog[changeLog.length - 1].updateNo + 1;
  //   }
  //   const index = this.sharedService.findEmp(employees, 'empId', id);
  //   console.log('updating');
  //   if (data.name) {
  //     change.before.name = employees[index].name;
  //     change.after.name = data.name;
  //     employees[index].name = data.name;
  //   }
  //   if (data.age) {
  //     change.before.age = employees[index].age;
  //     change.after.age = data.age;
  //     employees[index].age = data.age;
  //   }
  //   if (data.position) {
  //     change.before.position = employees[index].position;
  //     change.after.position = data.position;
  //     employees[index].position = data.position;
  //   }
  //   if (data.department) {
  //     change.before.department = employees[index].department;
  //     change.after.department = data.department;
  //     employees[index].department = data.department;
  //   }
  //   if (data.salary) {
  //     change.before.salary = employees[index].salary;
  //     change.after.salary = data.salary;
  //     employees[index].salary = data.salary;
  //   }
  //   if (data.privilege) {
  //     change.before.privilege = employees[index].privilege;
  //     change.after.privilege = data.privilege;
  //     employees[index].privilege = data.privilege;
  //   }
  //   if (data.rating) {
  //     change.before.rating = employees[index].rating;
  //     change.after.rating = data.rating;
  //     employees[index].rating = data.rating;
  //   }
  //   change.updatedAt = Date.now();
  //   changeLog.push(change);
  //   // writeFileSync(datapath, JSON.stringify(employees));
  //   this.sharedService.emp = employees;
  //   this.sharedService.changeLog = changeLog;
  // }

  // async updatePassword(
  //   req: AuthRequest,
  //   oldPassword: string,
  //   password: string,
  // ): Promise<string> {
  //   const emp = this.sharedService.emp;
  //   if (req.payload) {
  //     const email = req.payload.email;
  //     const index = this.sharedService.findEmp(emp, 'email', email);
  //     if (index === -1) {
  //       throw new UnauthorizedException('Email does not exist');
  //     }
  //     const correctPass = await bcrypt.compare(
  //       oldPassword,
  //       emp[index].password,
  //     );
  //     if (correctPass) {
  //       const changeLog: ChangeLogDto[] = this.sharedService.changeLog;
  //       const change: ChangeLogDto = {
  //         updateNo: 1,
  //         empId: emp[index].empId,
  //         createdAt: Date.now(),
  //         before: {},
  //         after: {},
  //         updatedAt: 0,
  //       };
  //       if (changeLog.length !== 0) {
  //         change.updateNo = changeLog[changeLog.length - 1].updateNo + 1;
  //       }
  //       change.before.password = emp[index].password;
  //       emp[index].password = await bcrypt.hash(password, 5);
  //       change.after.password = emp[index].password;
  //       changeLog.push(change);
  //       // writeFileSync(datapath, JSON.stringify(emp));
  //       this.sharedService.emp = emp;
  //       this.sharedService.changeLog = changeLog;
  //       return 'Password updated successfully';
  //     } else {
  //       return 'Old password is incorrect';
  //     }
  //   } else {
  //     throw new UnauthorizedException('Access token invalid');
  //   }
  // }
  async updatePasswordMongo(
    req: AuthRequest,
    oldPassword: string,
    password: string,
  ) {
    const emp = await this.employeeModel
      .findOne({
        email: req.payload.email,
      })
      .lean()
      .exec();
    if (!emp) {
      throw new UnauthorizedException('Authentication error');
    }
    const isMatch = await bcrypt.compare(oldPassword, emp.password);
    if (isMatch) {
      const change: ChangeLog = await this.sharedService.createChangeLog(
        emp.empId,
      );
      change.before.password = emp.password;
      const newPass = await bcrypt.hash(password, 5);
      change.after.password = newPass;
      const result = await this.employeeModel.findOneAndUpdate(
        { email: req.payload.email },
        { password: newPass },
      );
      console.log(result);
      if (result) {
        this.changeLogModel.collection.insertOne(change);
        return 'Password updated successfully';
      } else {
        new InternalServerErrorException();
      }
      // return result ? 'Success' : new InternalServerErrorException();
    }
  }
  async updateIdMongo(
    id: number,
    data: Partial<Employee>,
  ): Promise<Employee | null> {
    const emp = await this.employeeModel.findOneAndUpdate({ empId: id }, data);
    if (emp) {
      const change = await this.sharedService.createChangeLog(emp.empId);
      change.after = data;
      Object.keys(data).map((key) => {
        change.before[key] = emp[key];
      });
      this.changeLogModel.collection.insertOne(change);
      return await this.employeeModel.findOne({ empId: id });
    } else {
      throw new BadRequestException('Invalid employee ID');
    }
  }
}
