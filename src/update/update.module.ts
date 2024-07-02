import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { EmployeeDto } from 'src/read/dto/employee.dto';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [EmployeeDto, SharedModule],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
