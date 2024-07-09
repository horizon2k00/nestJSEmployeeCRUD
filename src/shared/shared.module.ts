import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChangeLog,
  ChangeLogSchema,
  Employee,
  EmployeeSchema,
} from 'src/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: ChangeLog.name, schema: ChangeLogSchema },
    ]),
  ],
  providers: [SharedService],
  exports: [SharedService, MongooseModule],
})
export class SharedModule {}
