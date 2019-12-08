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
import {Observable, Subscription, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {UserToken} from '../models/userToken';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  subscription: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router, private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authService.logout();
        location.reload(true);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

  private modifyRequest(req) {
    return req.clone({setHeaders: {authorization: (JSON.parse(localStorage.getItem('userToken')) as UserToken).access_token }});
  }
}
