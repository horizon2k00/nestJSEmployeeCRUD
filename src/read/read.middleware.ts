import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import { join } from 'path';
const datapath = join(__dirname, '../../data/data.json');
@Injectable()
export class FileExists implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!fs.existsSync(datapath)) {
      res.send('no employee present in company');
    } else {
      next();
    }
  }
}
