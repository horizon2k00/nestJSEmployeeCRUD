import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReadModule } from './read/read.module';
import { CreateModule } from './create/create.module';
import { SharedModule } from './shared/shared.module';
import { DeleteModule } from './delete/delete.module';
import { UpdateModule } from './update/update.module';

@Module({
  imports: [ReadModule, CreateModule, SharedModule, DeleteModule, UpdateModule], // for other @modules in nested folders
  controllers: [AppController], //for all @controllers in this root
  providers: [AppService], //for a   @injectables in this root
})
export class AppModule {}
