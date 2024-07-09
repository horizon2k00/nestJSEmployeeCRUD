import {
  Body,
  Controller,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BulkUpdateService } from './bulk-update.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { BulkUpdateDto } from './dto/bulk-update.dto';

@Controller('bulkupdate')
@UseGuards(AuthGuard, AdminGuard)
export class BulkUpdateController {
  constructor(private readonly bulkUpdateService: BulkUpdateService) {}

  @Put()
  updateBulk(@Body(ValidationPipe) body: BulkUpdateDto) {
    return this.bulkUpdateService.updateBulkMongo(body);
  }
}
