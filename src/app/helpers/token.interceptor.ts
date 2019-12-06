import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {UserToken} from '../models/userToken';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  currentUser: User;
  currentUserToken: UserToken;
  constructor(private authService: AuthService, private userService: UserService) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUserToken = currentUser;
      }
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestOption: any = {};
    if (this.currentUserToken && this.currentUserToken.access_token) {
      requestOption.setHeaders = {
        Authorization: `Bearer ${this.currentUserToken.access_token}`
      };
    }
    request = request.clone(requestOption);
    return next.handle(request);
  }
}
