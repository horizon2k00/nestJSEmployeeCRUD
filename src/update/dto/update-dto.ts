import {
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

export class UpdateEmployeeDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Z]([-']?[a-z]+)*( [A-Z]([-']?[a-z]+)*)+$/)
  readonly name?: string;

  @IsNumber()
  @Min(18)
  @Max(60)
  readonly age?: number;

  @IsEnum(['Intern', 'Developer', 'Tester', 'QA'])
  readonly position?: string;

  @IsEnum(['Frontend', 'Backend', 'Fullstack'])
  readonly department?: string;

  @IsNumber()
  readonly salary?: number;

  @IsEnum(['Admin', 'Employee'], {
    message: 'Privilege can only be Admin or Employee',
  })
  readonly privilege?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  readonly rating?: number;
}

export class PasswordUpdateDto {
  @IsString()
  oldPassword: string;
  @IsStrongPassword()
  password: string;
}

export interface AuthRequest extends Request {
  payload: {
    email: string;
    audience: string;
    privilege: 'Admin' | 'Employee';
  };
}
