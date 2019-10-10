import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../service/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestOption: any = {};
    // add authorization header with jwt token if available
    if (this.authService.getToken()) {
      requestOption.setHeaders = {
        Authorization: `Bearer ${this.authService.getToken()}`
      };
    }

    request = request.clone(requestOption);
    return next.handle(request)
    return next.handle(request);
  }
}
