import {
  IsString,
  Length,
  Matches,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsEmail,
  IsDate,
  IsInt,
} from 'class-validator';

export type keys =
  | 'empId'
  | 'name'
  | 'age'
  | 'salary'
  | 'position'
  | 'department'
  | 'privilege'
  | 'joindate'
  | 'rating';

export class EmployeeDto {
  [index: string]: string | number;
  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Z]([-']?[a-z]+)*( [A-Z]([-']?[a-z]+)*)+$/)
  name: string;

  @IsNumber()
  @Min(18)
  @Max(60)
  age: number;

  @IsEnum(['Intern', 'Developer', 'Tester', 'QA'])
  position: string;

  @IsEnum(['Frontend', 'Backend', 'Fullstack'])
  department: string;

  @IsNumber()
  salary: number;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['Admin', 'Employee'], {
    message: 'Privilege can only be Admin or Employee',
  })
  privilege: string;

  @IsDate()
  joinDate: string;

  @IsInt()
  @Min(0)
  @Max(100)
  rating: number;

  @IsNumber()
  empId: number;
}

export class ChangeLogDto {
  id: number;
  empId: number;
  createdAt: number;
  before: {
    [index: string]: string | number;
  };
  after: {
    [index: string]: string | number;
  };
  updatedAt: number;
}
