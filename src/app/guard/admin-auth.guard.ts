import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import {AuthService} from '../service/auth.service';
import {UserToken} from '../model/userToken';
import {User} from '../model/user';
import {UserService} from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  currentUser: User;
  constructor(private router: Router, private userService: UserService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let hasRoleAdmin = false;
    if (!!this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.name === 'ROLE_ADMIN') {
          hasRoleAdmin = true;
          break;
        }
      }
      if (hasRoleAdmin) {
        return true;
      } else {
        this.router.navigate(['/', 'admin', 'dashboard'], { queryParams: {login: true}, queryParamsHandling: 'merge' } );
        return false;
      }
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/', 'admin', 'login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!this.currentUser) {
      const roleList = this.currentUser.roles;
      let hasRoleAdmin = false;
      for (const role of roleList) {
        if (role.name === 'ROLE_ADMIN') {
          hasRoleAdmin = true;
          break;
        }
      }
      return hasRoleAdmin;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/', 'admin', 'login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
  canLoad(route: Route, segments: UrlSegment[]) {
    return true;
  }
}
