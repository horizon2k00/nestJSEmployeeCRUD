import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { BulkUpdateDto } from './dto/bulk-update.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeLog, Employee } from 'src/schemas/employee.schema';
import { Model } from 'mongoose';

@Injectable()
export class BulkUpdateService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(ChangeLog.name) private changeLogModel: Model<ChangeLog>,
    private readonly sharedService: SharedService,
  ) {}

  async updateBulkMongo(body: BulkUpdateDto) {
    // const updated = await this.employeeModel
    //   .updateMany(
    //     {
    //       empId: { $in: body.empId },
    //     },
    //     { $inc: { [body.field]: body.increment } },
    //   )
    //   .lean()
    //   .exec();
    // console.log(updated);
    // return updated;
    const updateList: number[] = [];
    for (let i = 0; i < body.empId.length; i++) {
      const id = body.empId[i];
      const change = await this.sharedService.createChangeLog(id);
      const before = await this.employeeModel.findOneAndUpdate(
        { empId: id },
        { $inc: { [body.field]: body.increment } },
      );
      if (before) {
        change.before[body.field] = before[body.field];
        const updated = await this.employeeModel
          .findOne({
            empId: id,
          })
          .lean()
          .exec();

        if (updated) {
          change.after[body.field] = updated[body.field];
          this.changeLogModel.collection.insertOne(change);
          updateList.push(id);
        } else {
          throw new InternalServerErrorException(
            `could not get update. Current updated list ${updateList}`,
          );
        }
      } else {
        throw new InternalServerErrorException(
          `Could not update. Current updated list ${updateList}`,
        );
      }
    }
    if (body.field === 'rating') {
      console.log(body.field);

      const gtlist = await this.employeeModel
        .updateMany({ rating: { $gt: 100 } }, { $set: { rating: 100 } })
        .lean()
        .exec();
      const ltlist = await this.employeeModel.updateMany(
        { rating: { $lt: 0 } },
        { rating: 0 },
      );
      console.log(gtlist);
      console.log(ltlist);
    }
    if (body.field === 'age') {
      const gtlist = await this.employeeModel
        .updateMany({ age: { $gt: 60 } }, { age: 60 })
        .lean()
        .exec();
      const ltlist = await this.employeeModel
        .updateMany({ age: { $lt: 18 } }, { age: 18 })
        .lean()
        .exec();
      console.log(gtlist);
      console.log(ltlist);
    }
    if (body.field === 'salary') {
      const ltlist = await this.employeeModel
        .updateMany({ salary: { $lt: 0 } }, { salary: 0 })
        .lean()
        .exec();
      console.log(ltlist);
    }
    return updateList;
  }
}
