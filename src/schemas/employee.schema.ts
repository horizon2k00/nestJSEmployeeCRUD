import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

@Schema()
export class Employee {
  [key: string]: number | string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Z]([-']?[a-z]+)*( [A-Z]([-']?[a-z]+)*)+$/)
  @Prop()
  name: string;

  @IsNumber()
  @Min(18)
  @Max(60)
  @Prop()
  age: number;

  @IsEnum(['Intern', 'Developer', 'Tester', 'QA'])
  @Prop()
  position: string;

  @IsEnum(['Frontend', 'Backend', 'Fullstack'])
  @Prop()
  department: string;

  @IsNumber()
  @Prop()
  salary: number;

  @IsEmail()
  @Prop()
  email: string;

  @IsString()
  @Prop()
  password: string;

  @IsEnum(['Admin', 'Employee'], {
    message: 'Privilege can only be Admin or Employee',
  })
  @Prop()
  privilege: string;

  @IsDate()
  @Prop()
  joinDate: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @Prop()
  rating: number;

  @IsNumber()
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
