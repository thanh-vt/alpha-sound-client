import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';

import {UserProfileService} from '../service/user-profile.service';
import {AuthService} from '../service/auth.service';
import {map} from 'rxjs/operators';
import {AuthUtil} from '../util/auth.util';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private router: Router, private userService: UserProfileService,
              private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser$
      .pipe(
        map(user => {
          if (user) {
            if (AuthUtil.isAdmin(user)) {
              return true;
            } else {
              this.router.navigate(['/', 'admin', 'dashboard'], {queryParams: {login: true}, queryParamsHandling: 'merge'});
              return false;
            }
          } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/', 'admin', 'login'], {queryParams: {returnUrl: state.url}});
            return false;
          }
        })
      );

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser$
      .pipe(
        map(user => {
          if (user) {
            return AuthUtil.isAdmin(user);
          } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/', 'admin', 'login'], {queryParams: {returnUrl: state.url}});
            return false;
          }
        })
      );
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    return true;
  }
}
