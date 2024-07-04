import {
  Controller,
  Param,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ReadService } from './read.service';
import { AdminGuard, AuthGuard, IsAuthorisedGuard } from 'src/auth/auth.guard';
import {
  DeptDto,
  PaginationDto,
  RatingDto,
  SortedDto,
} from './dto/employee.dto';

@Controller('emp')
@UseGuards(AuthGuard)
export class ReadController {
  constructor(private readonly readService: ReadService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: PaginationDto,
  ) {
    return this.readService.findAll(query.limit, query.page);
  }

  @Get('/sorted')
  @UseGuards(AdminGuard)
  getSorted(@Query(new ValidationPipe({ transform: true })) query: SortedDto) {
    return this.readService.getSorted(
      query.param,
      query.limit,
      query.page,
      query.order,
    );
  }

  @Get('dept')
  @UseGuards(AdminGuard)
  getByDept(@Query(new ValidationPipe({ transform: true })) query: DeptDto) {
    console.log(query.limit);
    return this.readService.getByDept(query.dept, query.limit, query.page);
  }

  @Get('greaterthan')
  @UseGuards(AdminGuard)
  getEmpGt(@Query(new ValidationPipe({ transform: true })) query: RatingDto) {
    return this.readService.getEmpGt(query.rating, query.limit, query.page);
  }

  @Get('lessthan')
  @UseGuards(AdminGuard)
  getEmpLt(@Query(new ValidationPipe({ transform: true })) query: RatingDto) {
    console.log(query.limit);

    return this.readService.getEmpLt(query.rating, query.limit, query.page);
  }

  @Get('count')
  @UseGuards(AdminGuard)
  getEmpCount() {
    return this.readService.getEmpCount();
  }

  @Get('count/dept')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getDeptCount(
    @Query() // isnt usable now but just setup dto for query obj and put validation decorators on those.
    query: DeptDto,
  ) {
    console.log(query);
    return this.readService.getDeptCount(query.dept);
  }

  @Get(':id')
  @UseGuards(IsAuthorisedGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.readService.findOne(id);
  }
}
