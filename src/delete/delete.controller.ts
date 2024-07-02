import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { DeleteService } from './delete.service';

@Controller('delete')
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
