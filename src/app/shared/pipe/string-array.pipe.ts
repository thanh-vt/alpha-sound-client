import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringArray'
})
export class StringArrayPipe implements PipeTransform {
  transform(value: { name: string }[]): string {
    if (value) {
      return value.map(e => e.name).join(', ');
    }
    return '';
  }
}
