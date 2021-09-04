import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      return { day: Number(dateParts[0]) ?? 1, month: Number(dateParts[1]) ?? 1, year: Number(dateParts[2]) ?? 2000 };
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ? `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}` : '';
  }
}
