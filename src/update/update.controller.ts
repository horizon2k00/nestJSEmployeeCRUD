import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateEmployeeDto } from './dto/update-dto';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Put('/:id')
  updateId(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    data: UpdateEmployeeDto,
  ) {
    try {
      this.updateService.updateId(id, data);
      return `Updated employee ${id} successfully`;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
