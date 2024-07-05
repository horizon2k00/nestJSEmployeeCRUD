import { Module } from '@nestjs/common';
import { BulkUpdateService } from './bulk-update.service';
import { BulkUpdateController } from './bulk-update.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BulkUpdateController],
  providers: [BulkUpdateService],
})
export class BulkUpdateModule {}
