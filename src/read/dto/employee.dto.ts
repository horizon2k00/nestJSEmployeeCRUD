import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { keys } from 'src/shared/dto/shared.dto';

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
  joinDate: number;

  @IsInt()
  @Min(0)
  @Max(100)
  rating: number;

  @IsNumber()
  empId: number;
}

export class SortedDto {
  @IsEnum([
    'empId',
    'name',
    'age',
    'salary',
    'position',
    'department',
    'privilege',
    'joindate',
    'rating',
  ])
  param: keys;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 5;
    } else {
      return 5;
    }
  })
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 1;
    } else {
      return 1;
    }
  })
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? 1 : -1;
    } else {
      return 1;
    }
  })
  order: number;
}

export class RatingDto {
  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 5;
    } else {
      return 5;
    }
  })
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 1;
    } else {
      return 1;
    }
  })
  page: number;

  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val >= 0 ? (val <= 100 ? val : 50) : 50;
    } else {
      return 50;
    }
  })
  @IsInt()
  rating: number;
}

export class DeptDto {
  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 5;
    } else {
      return 5;
    }
  })
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 1;
    } else {
      return 1;
    }
  })
  page: number;

  @IsEnum(['Frontend', 'Backend', 'Fullstack'])
  dept: 'Frontend' | 'Backend' | 'Fullstack';
}

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 5;
    } else {
      return 5;
    }
  })
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value);
    if (val) {
      return val > 0 ? val : 1;
    } else {
      return 1;
    }
  })
  page: number;
}
