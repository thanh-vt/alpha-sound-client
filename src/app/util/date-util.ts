import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateUtil {
  public static getMinDate(): NgbDateStruct {
    const currentYear = new Date().getUTCFullYear();
    return { year: currentYear - 150, month: 1, day: 1 };
  }

  public static getMaxDate(): NgbDateStruct {
    const today = new Date();
    return { year: today.getUTCFullYear(), month: today.getMonth(), day: today.getDate() };
  }
}
