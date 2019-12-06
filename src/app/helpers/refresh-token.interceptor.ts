import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
  HttpParams, HttpHeaders
} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {UserToken} from '../models/userToken';


@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  subscription: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router, private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('rememberMe')) {
      return next.handle(this.modifyRequest(request)).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (request.url.includes('/oauth/token')) {
              // We do another check to see if refresh token failed
              // In this case we want to logout user and to redirect it to login page
              if (request.url.includes('/grant_type=refresh_token')) {
                this.authService.logout();
                this.router.navigate(['/home']);
              }
            }
            if (error.status === 401) {
              const params = new HttpParams()
                .set('grant_type', 'refresh_token')
                .set('refresh_token', ( JSON.parse(localStorage.getItem('userToken')) as UserToken).refresh_token);
              const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                Authorization : 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)});
              return this.injector.get(HttpClient)
                .post(`${environment.authUrl}/oauth/token`, params, {headers})
                .pipe(
                  mergeMap(res => {
                    localStorage.setItem('userToken', JSON.stringify(res));
                    return next.handle(this.modifyRequest(request));
                  })
                );
            }
          } else {
            return Observable.throw(error);
          }
        })
      );
    } else {
      return next.handle(request).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.authService.logout();
            return Observable.throw(error);
          }
        })
      );
      // return next.handle(request);
    }
  }

  private modifyRequest(req) {
    return req.clone({setHeaders: {authorization: (JSON.parse(localStorage.getItem('userToken')) as UserToken).access_token }});
  }
}
