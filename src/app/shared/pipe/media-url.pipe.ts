import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'mediaUrl'
})
export class MediaUrlPipe implements PipeTransform {
  transform(value: string, isAuth = false): string {
    if (value) {
      if (value.startsWith('/')) {
        return isAuth ? `${environment.authUrl}${value}` : `${environment.apiRootUrl}${value}`;
      } else {
        return value;
      }
    }
    return value;
  }
}
