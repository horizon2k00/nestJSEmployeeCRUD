import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SalaryReadService } from './salary-read.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { DeptDto } from './dto/salaryList-dto';

@Controller('salary')
@UseGuards(AuthGuard, AdminGuard)
export class SalaryReadController {
  constructor(private readonly salaryReadService: SalaryReadService) {}

  @Get('report')
  async downloadReport(@Res() res: Response) {
    res.download(await this.salaryReadService.downloadReport());
  }

  @Get('top')
  getTop(@Query('number', new DefaultValuePipe(3), ParseIntPipe) i: number) {
    return this.salaryReadService.getTop(i);
  }

  @Get('average')
  getSalaryAvg() {
    return this.salaryReadService.getSalaryAvg();
  }

  @Get('average/dept/all')
  getAllDeptAvg() {
    return this.salaryReadService.getAllDeptAvg();
  }

  @Get('average/dept')
  getAvgByDept(@Query(ValidationPipe) query: DeptDto) {
    return this.salaryReadService.getAvgBydept(query.dept);
  }

  @Get('deptmaxmin')
  getDeptMaxMin(@Query(ValidationPipe) query: DeptDto) {
    return this.salaryReadService.getDeptMaxMin(query.dept);
  }
}
