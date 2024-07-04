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

@Controller('create')
@UseGuards(AuthGuard, AdminGuard)
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post()
  createEntry(@Body(ValidationPipe) emp: CreateEmployeeDto) {
    return this.createService.createEmployee(emp);
  }
}
