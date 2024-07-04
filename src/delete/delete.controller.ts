import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DeleteService } from './delete.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';

@Controller('delete')
@UseGuards(AuthGuard, AdminGuard)
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete('/all')
  deleteAll() {
    return this.deleteService.deleteAll();
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteService.deleteId(id);
  }
}
