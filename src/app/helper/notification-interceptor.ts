import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  private subject: Subject<HttpErrorResponse> = new Subject<HttpErrorResponse>();

  constructor(private translate: TranslateService, private toastService: VgToastService) {
    this.subject.subscribe(err => {
      let msg: string;
      if (err?.status === 0) {
        msg = this.translate.instant('common.error.connection_problem');
      } else {
        msg = err?.error?.message ?? this.translate.instant('common.error.unknown');
      }
      this.toastService.show({ text: msg }, { type: TOAST_TYPE.ERROR });
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.subject.next(err);
        throw err.error;
      })
    );
  }
}
