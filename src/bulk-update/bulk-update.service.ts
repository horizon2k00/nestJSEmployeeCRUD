import { Injectable } from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { BulkUpdateDto } from './dto/bulk-update.dto';
import { ChangeLogDto, EmployeeDto } from 'src/shared/dto/shared.dto';

@Injectable()
export class BulkUpdateService {
  constructor(private readonly sharedService: SharedService) {}

  updateBulk(body: BulkUpdateDto): Partial<EmployeeDto>[] {
    const emp = this.sharedService.emp;
    const changeLog = this.sharedService.changeLog;
    const updateList: Partial<EmployeeDto>[] = [];
    if (body.field === 'salary') {
      emp.map((emp) => {
        body.empId.map((id) => {
          if (emp.empId === id) {
            const change: ChangeLogDto = this.sharedService.createChangeLog(
              emp,
              changeLog,
            );
            change.before[body.field] = emp[body.field];
            emp[body.field] = emp[body.field] * (1 + body.increment / 100);
            change.after[body.field] = emp[body.field];
            change.updatedAt = Date.now();
            changeLog.push(change);
            updateList.push({
              empId: emp.empId,
              name: emp.name,
              [body.field]: emp[body.field],
            });
          }
        });
      });
    } else {
      emp.map((emp) => {
        body.empId.map((id) => {
          if (emp.empId === id) {
            const change: ChangeLogDto = this.sharedService.createChangeLog(
              emp,
              changeLog,
            );
            change.before[body.field] = emp[body.field];
            emp[body.field] += body.increment;
            change.after[body.field] = emp[body.field];
            change.updatedAt = Date.now();
            changeLog.push(change);
            updateList.push({
              empId: emp.empId,
              name: emp.name,
              [body.field]: emp[body.field],
            });
          }
        });
      });
    }
    this.sharedService.emp = emp;
    this.sharedService.changeLog = changeLog;
    return updateList;
  }
}
