import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Employee {
  [key: string]: number | string;
  @Prop()
  name: string;
  @Prop()
  age: number;
  @Prop()
  position: string;
  @Prop()
  department: string;
  @Prop()
  salary: number;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  privilege: string;
  @Prop()
  joinDate: number;
  @Prop()
  rating: number;
  @Prop()
  empId: number;
}
export const EmployeeSchema = SchemaFactory.createForClass(Employee);

@Schema()
export class ChangeLog {
  @Prop()
  updateNo: number;
  @Prop()
  empId: number;
  @Prop()
  createdAt: number;
  @Prop({ type: Employee })
  before: Partial<Employee>;
  @Prop({ type: Employee })
  after: Partial<Employee>;
  @Prop()
  updatedAt: number;
  @Prop()
  allDeleted?: boolean;
}

export const ChangeLogSchema = SchemaFactory.createForClass(ChangeLog);
