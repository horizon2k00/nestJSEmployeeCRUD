import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  [index: string]: string | number;
  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Z]([-']?[a-z]+)*( [A-Z]([-']?[a-z]+)*)+$/, {
    message:
      'Name must start with capital letter, first letters of all following words must be capital. \n Must contain only (a-zA-Z)',
  })
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

  @IsStrongPassword()
  password: string;

  @IsEnum(['Admin', 'Employee'], {
    message: 'Privilege can only be Admin or Employee',
  })
  privilege: string;

  @IsString()
  joinDate: string;

  @IsInt()
  @Min(0)
  @Max(100)
  rating: number;

  @IsEmpty()
  empId: number;
}
