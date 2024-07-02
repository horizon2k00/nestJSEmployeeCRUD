import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DeleteService } from './delete.service';
import { DeleteController } from './delete.controller';
import { EmployeesExist } from './delete.middleware';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [DeleteController],
  providers: [DeleteService, EmployeesExist],
})
export class DeleteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmployeesExist).forRoutes('/delete**');
  }
}
