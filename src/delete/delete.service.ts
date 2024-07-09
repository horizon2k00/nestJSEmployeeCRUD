import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class DeleteService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
    private readonly sharedService: SharedService,
  ) {}

  async deleteAll() {
    // const changeCount = await this.changeLogModel.collection.countDocuments();
    const change: ChangeLog = await this.sharedService.createChangeLog(NaN);
    change.allDeleted = true;
    const updatelogs = await this.changeLogModel.collection.insertOne(change);
    console.log(updatelogs);
    const delRes = await this.employeeModel.deleteMany({});
    return delRes.acknowledged
      ? delRes.deletedCount === 0
        ? new BadRequestException('No employees in database')
        : 'Employee DB successfully deleted'
      : new InternalServerErrorException('Delete request unsuccessful');
  }

  async deleteId(id: number) {
    const delRes: Employee | null = await this.employeeModel
      .findOneAndDelete({ empId: id })
      .lean()
      .exec();
    console.log(delRes);
    const change: ChangeLog = await this.sharedService.createChangeLog(id);
    if (delRes) {
      change.before = delRes;
      this.changeLogModel.collection.insertOne(change);
      return `Employee id ${id} deleted successfuly`;
    } else {
      throw new BadRequestException('Invalid id');
    }
  }
}
