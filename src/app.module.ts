import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReadModule } from './read/read.module';
import { CreateModule } from './create/create.module';
import { SharedModule } from './shared/shared.module';
import { DeleteModule } from './delete/delete.module';
import { UpdateModule } from './update/update.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SalaryReadModule } from './salary-read/salary-read.module';
import { BulkUpdateModule } from './bulk-update/bulk-update.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/employeesDB'),
    ReadModule,
    CreateModule,
    SharedModule,
    DeleteModule,
    UpdateModule,
    AuthModule,
    SalaryReadModule,
    BulkUpdateModule,
  ], // for other @modules in nested folders
  controllers: [AppController], //for all @controllers in this root
  providers: [AppService], //for a   @injectables in this root
})
export class AppModule {}
