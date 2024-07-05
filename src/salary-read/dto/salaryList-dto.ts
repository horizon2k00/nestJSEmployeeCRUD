import { IsEnum } from 'class-validator';

export class DeptDto {
  @IsEnum(['Frontend', 'Backend', 'Fullstack'])
  dept: 'Frontend' | 'Backend' | 'Fullstack';
}
