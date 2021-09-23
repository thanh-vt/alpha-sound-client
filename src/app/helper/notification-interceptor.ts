import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TOAST_TYPE, VgHerokuWakeupService, VgToastService } from 'ngx-vengeance-lib';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  static translateService;

  constructor(
    private vgHerokuWakeupService: VgHerokuWakeupService,
    private translate: TranslateService,
    private toastService: VgToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.vgHerokuWakeupService.trackRequest.next(null);
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg: string;
        if (err?.status === 0) {
          msg = this.translate.instant('common.error.timeout');
        } else {
          msg = err?.error?.message || err?.error?.error || this.translate.instant('common.error.unknown');
        }
        this.toastService.error({ text: msg });
        throw err.error;
      })
    );
  }
}
