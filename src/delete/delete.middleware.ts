import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
const datapath = join(__dirname, '../../data/data.json');

@Injectable()
export class EmployeesExist implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!existsSync(datapath)) {
      res.send('No employee in database');
    } else if (JSON.parse(readFileSync(datapath, 'utf-8')).length === 0) {
      res.send('No employee present');
    } else {
      next();
    }
  }
}
