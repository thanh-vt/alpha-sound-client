import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(private translate: TranslateService, private toastService: VgToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        let msg;
        if (error.status === 0) {
          msg = this.translate.instant('common.error.connection_problem');
        } else {
          msg = error?.error?.message ?? this.translate.instant('common.error.unknown');
        }
        this.toastService.show({ text: msg }, { type: TOAST_TYPE.ERROR });
        throw error.error;
      })
    );
  }
}
