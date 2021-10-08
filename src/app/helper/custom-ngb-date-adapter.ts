import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomNgbDateAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    if (!date) return null;
    const dateObj = new Date(date);
    return dateObj
      ? {
          year: dateObj.getUTCFullYear(),
          month: dateObj.getUTCMonth() + 1,
          day: dateObj.getUTCDate()
        }
      : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0)) : null;
  }
}
