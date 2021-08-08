import { HttpParams } from '@angular/common/http';

export class HttpUtil {
  public static buildParams(option?: { page?: number; size?: number; sort?: string[] }): HttpParams {
    let params: HttpParams = new HttpParams();
    if (option?.page) {
      params = params.set('page', option.page);
    }
    if (option?.size) {
      params = params.set('size', option.size);
    }
    if (option?.sort) {
      for (const sort of option.sort) {
        params = params.append('sort', sort);
      }
    }
    return params;
  }
}
