import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateEmployeeDto } from './dto/create.dto';

@Controller('create')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post()
  createEntry(@Body(ValidationPipe) emp: CreateEmployeeDto) {
    return this.createService.createEmployee(emp);
  }
}
