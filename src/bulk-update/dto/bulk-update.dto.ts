import { ArrayMinSize, IsEnum, IsNumber } from 'class-validator';

export class BulkUpdateDto {
  @IsEnum(['salary', 'rating', 'age'])
  field: 'salary' | 'rating' | 'age';

  @ArrayMinSize(1)
  empId: number[];

  @IsNumber()
  increment: number;
}
