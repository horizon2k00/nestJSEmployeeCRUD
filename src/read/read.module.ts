import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReadService } from './read.service';
import { ReadController } from './read.controller';
import { FileExists } from './read.middleware';
import { EmployeeDto } from './dto/employee.dto';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ReadController],
  providers: [ReadService, FileExists, EmployeeDto],
  exports: [EmployeeDto],
})
export class ReadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileExists)
      .forRoutes({ path: '/emp**', method: RequestMethod.GET });
  }
}
