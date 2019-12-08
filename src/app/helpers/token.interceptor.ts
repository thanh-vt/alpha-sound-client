import {Injectable, Injector} from '@angular/core';

import {AuthService} from '../services/auth.service';
import {UserToken} from '../models/userToken';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {catchError, mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
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
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  currentUserToken: UserToken;
  constructor(private authService: AuthService, private router: Router, private injector: Injector) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUserToken = currentUser;
      }
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('userToken') || sessionStorage.getItem('userToken')) {
      return next.handle(this.modifyRequest(request)).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 && request.url.includes('/oauth/token')) {
              this.authService.logout();
              this.router.navigate(['/home']);
            } else if (error.status === 401 && !request.url.includes('/oauth/token')) {
              let refreshToken: string;
              if (localStorage.getItem('userToken')) {
                refreshToken = ( JSON.parse(localStorage.getItem('userToken')) as UserToken).refresh_token;
              }
              if (sessionStorage.getItem('sessionToken')) {
                refreshToken = ( JSON.parse(sessionStorage.getItem('userToken')) as UserToken).refresh_token;
              }
              const params = new HttpParams()
                .set('grant_type', 'refresh_token')
                .set('refresh_token', refreshToken);
              const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                Authorization : 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)});
              return this.injector.get(HttpClient)
                .post(`${environment.authUrl}/oauth/token`, params, {headers})
                .pipe(
                  mergeMap(res => {
                    if (localStorage.getItem('rememberMe')) {
                      localStorage.setItem('userToken', JSON.stringify(res));
                    } else {
                      localStorage.setItem('sessionToken', JSON.stringify(res));
                      sessionStorage.setItem('userToken', JSON.stringify(res));
                    }
                    return next.handle(this.modifyRequest(request));
                  })
                );
            }
          } else {
            return throwError(new Error(error.message));
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private modifyRequest(req) {
    let accessToken;
    if (localStorage.getItem('userToken')) {
      accessToken = (JSON.parse(localStorage.getItem('userToken')) as UserToken).access_token;
    }
    if (sessionStorage.getItem('userToken')) {
      accessToken = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).access_token;
    }
    return req.clone({setHeaders: {authorization: `Bearer ${accessToken}`}});
  }
}
