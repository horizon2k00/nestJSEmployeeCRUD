import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateEmployeeDto } from './dto/create.dto';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { Employee } from 'src/schemas/employee.schema';

@Controller('create')
@UseGuards(AuthGuard, AdminGuard)
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post()
  async createEntry(
    @Body(ValidationPipe) emp: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.createService.createEmployee(emp);
  }
}
