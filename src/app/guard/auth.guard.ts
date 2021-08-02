import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UserProfile } from '../model/token-response';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  currentUser: UserProfile;
  constructor(private router: Router, private authService: AuthService) {
    this.authService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUser) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUser) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
