import { Module } from '@nestjs/common';
import { SalaryReadService } from './salary-read.service';
import { SalaryReadController } from './salary-read.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [SalaryReadController],
  providers: [SalaryReadService],
})
export class SalaryReadModule {}
