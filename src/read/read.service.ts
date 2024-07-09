import { ImATeapotException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { SharedService } from '../shared/shared.service';
import { keys } from 'src/shared/dto/shared.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';

@Injectable()
export class ReadService {
  datapath = join(__dirname, '../../data/data.json');
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
    private readonly sharedService: SharedService,
  ) {}
  async findAll(limit: number, page: number) {
    //return only id, name, age and rating
    const emp = await this.employeeModel
      .find({})
      .select({ empId: 1, name: 1, age: 1, salary: 1 })
      .lean()
      .exec();
    console.log(emp);

    return this.sharedService.paginate(emp, limit, page);
    // return emp;
  }

  async findOne(id: string): Promise<string | Employee> {
    const emp = await this.employeeModel.findById(
      { _id: id },
      { _id: 0, password: 0, __v: 0 },
    );
    console.log(emp);
    if (!emp) {
      return 'Employee not found';
    }
    return emp;
  }

  async getSorted(
    param: keys,
    limit: number | null | undefined,
    page: number | null | undefined,
    order: number | null | undefined,
  ): Promise<Employee[]> {
    console.log(param, limit, page, order);
    if (order !== 1 && order !== -1) {
      order = 1;
    }
    if (order === 1 || order === -1) {
      const emp = await this.employeeModel
        .find(
          {},
          { name: 1, age: 1, position: 1, department: 1, salary: 1, email: 1 },
        )
        .sort({ [param]: order })
        .lean()
        .exec();
      return this.sharedService.paginate(emp, limit, page);
    } else {
      throw new ImATeapotException();
    }
  }

  async getByDept(
    dept: 'Frontend' | 'Backend' | 'Fullstack',
    limit: number | null | undefined,
    page: number | null | undefined,
  ): Promise<Employee[]> {
    console.log('in get by dept');
    const emp = await this.employeeModel
      .find({ department: dept })
      .lean()
      .exec();
    console.log(emp);

    return this.sharedService.paginate(emp, limit, page);
  }

  async getEmpGt(
    rating: number,
    limit: number | null | undefined,
    page: number | null | undefined,
  ): Promise<Employee[]> {
    const emp = await this.employeeModel
      .find({ rating: { $gt: rating } })
      .sort({ rating: -1 });
    return this.sharedService.paginate(emp, limit, page);
  }

  async getEmpLt(
    rating: number,
    limit: number | null | undefined,
    page: number | null | undefined,
  ): Promise<Employee[]> {
    const emp = await this.employeeModel
      .find({ rating: { $lt: rating } })
      .sort({ rating: -1 });
    return this.sharedService.paginate(emp, limit, page);
  }

  async getEmpCount(): Promise<number> {
    return await this.employeeModel.collection.countDocuments();
  }

  async getDeptCount(
    dept: 'Frontend' | 'Backend' | 'Fullstack' | string,
  ): Promise<number> {
    const emp = this.employeeModel.collection.countDocuments({
      department: dept,
    });

    return emp;
  }
  // last boss -1
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getEmpHistory(empId: number) {
    // const empChangeLog = this.sharedService.changeLog.filter(
    //   (e) => e.empId === empId,
    // );
    // empChangeLog.sort((a, b) => b.updatedAt - a.updatedAt);
    // const empHist: {
    //   update: number;
    //   updatedAt: number;
    //   after: object;
    //   before: object;
    // }[] = [];
    // let update = empChangeLog.length;
    // empChangeLog.map((e) => {
    //   const { updatedAt, after, before } = e;
    //   empHist.push({ update: update--, updatedAt, after, before });
    // });
    // return empHist;
    const empHist = this.changeLogModel
      .find({ empId: empId })
      .lean()
      .sort({ updatedAt: -1 })
      .exec();
    return empHist;
  }
}
