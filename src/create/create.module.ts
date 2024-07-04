import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateController } from './create.controller';
import { FileExists } from './create.middleware';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CreateController],
  providers: [CreateService, FileExists],
})
export class CreateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileExists).forRoutes('/create');
  }
}
