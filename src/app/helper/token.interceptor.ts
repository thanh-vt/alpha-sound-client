import { Injectable, Injector } from '@angular/core';

import { AuthService } from '../service/auth.service';
import { TokenResponse } from '../model/token-response';
import { catchError, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';
import { ToastService } from '../shared/service/toast.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  // @ts-ignore
  delay;

  constructor(
    private authService: AuthService,
    private router: Router,
    private injector: Injector,
    private tokenStorageService: TokenStorageService,
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.attachTokenToRequest(request)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (request.url.includes('/oauth/token')) {
            return this.handleOauth2RequestError(request, next, error);
          } else {
            return this.handleNormalRequestError(request, next, error);
          }
        } else {
          throw error;
        }
      })
    );
  }

  handleNormalRequestError(request: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error.status === 401) {
      const refreshTokenInfo = this.tokenStorageService.refreshToken;
      if (!refreshTokenInfo) {
        throw error;
      }
      const params = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', refreshTokenInfo.token);
      const headers = new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        Authorization: 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
      });
      return this.injector
        .get(HttpClient)
        .post<TokenResponse>(`${environment.authUrl}/oauth/token`, params.toString(), { headers })
        .pipe(
          mergeMap(res => {
            this.tokenStorageService.storeRefreshToken(res);
            return next.handle(this.attachTokenToRequest(request)).pipe(
              catchError(err => {
                console.error(err);
                // this.redirectOut();
                throw err;
              })
            );
          }),
          catchError(err => {
            console.error(err);
            this.redirectOut();
            throw err;
          })
        );
    } else {
      throw error;
    }
  }

  handleOauth2RequestError(request: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error?.error?.error_description && error?.error?.error_description.startsWith('Invalid refresh token')) {
      // this.authService.sessionTimeout.emit();
      this.toastService.info('Info', 'Your session expired');
      this.redirectOut();
    }
    throw error;
  }

  attachTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    if (req.serializeBody() == null || !req.serializeBody().toString().includes('refresh_token')) {
      const tokenInfo = this.tokenStorageService.accessToken;
      console.log(tokenInfo);
      if (tokenInfo) {
        switch (tokenInfo.mode) {
          case 'cookie':
            return req.clone({ withCredentials: true });
          case 'header':
            return req.clone({ setHeaders: { Authorization: `Bearer ${tokenInfo.token}` } });
        }
      }
    }
    return req;
  }

  redirectOut(): void {
    if (this.delay) {
      return;
    }
    console.log('redirect out 1');
    this.authService.logout();

    // this.router.navigate(['/home'])
    //   .finally(() => {
    //     this.delay = setTimeout(() => {
    //       // location.reload();
    //       console.log('redirect out 2');
    //       clearTimeout(this.delay);
    //     }, 3000);
    //   });
  }
}
