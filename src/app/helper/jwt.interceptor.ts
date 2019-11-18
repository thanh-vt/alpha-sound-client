import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {UserToken} from '../model/userToken';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUser: UserToken;
  constructor(private authService: AuthService) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestOption: any = {};
    // add authorization header with jwt token if available
    if (this.currentUser) {
      requestOption.setHeaders = {
        Authorization: `Bearer ${this.currentUser.accessToken}`
      };
    }
    request = request.clone(requestOption);
    return next.handle(request);
  }
}
