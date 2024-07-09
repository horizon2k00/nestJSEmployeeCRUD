import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UpdateService } from './update.service';
import { AuthRequest, PasswordUpdateDto } from './dto/update-dto';
import { AuthGuard, IsAuthorisedGuard } from 'src/auth/auth.guard';
import { Employee } from 'src/schemas/employee.schema';

@Controller('update')
@UseGuards(AuthGuard)
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Put('/password')
  updatePassword(
    @Req() req: AuthRequest,
    @Body(ValidationPipe) body: PasswordUpdateDto,
  ) {
    return this.updateService.updatePasswordMongo(
      req,
      body.oldPassword,
      body.password,
    );
  }

  @Put('/:id')
  @UseGuards(IsAuthorisedGuard)
  updateId(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    data: Partial<Employee>,
  ) {
    return this.updateService.updateIdMongo(id, data);
  }
}
