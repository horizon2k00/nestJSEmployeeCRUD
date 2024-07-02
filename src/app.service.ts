import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSomeData(): object {
    return { text: 'Hello World this is K!' };
  }
}
