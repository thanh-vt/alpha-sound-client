import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value = 0): unknown {
    // const h = Math.floor(value / 3600)
    //   .toString()
    //   .padStart(2, '0');
    if (isNaN(value)) return `00:00`;
    const m = Math.floor((value % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(value % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }
}
