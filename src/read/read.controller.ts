import { Controller, Param, Get, ParseIntPipe } from '@nestjs/common';
import { ReadService } from './read.service';

@Controller('emp')
export class ReadController {
  constructor(private readonly readService: ReadService) {}

  @Get()
  findAll() {
    return this.readService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.readService.findOne(id);
  }
}
