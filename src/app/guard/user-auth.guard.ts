import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, UrlTree, UrlSegment } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VgToastService } from 'ngx-vengeance-lib';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivateChild {
  readonly userAccessOnlyMenu: string[] = ['playlist', 'uploaded/song', 'uploaded/album', 'favorites'];
  readonly anonymousAccessOnlyMenu: string[] = ['register', 'complete-registration', 'reset-password-submission', 'reset-password'];

  constructor(private router: Router, private authService: AuthService, private toastService: VgToastService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    return this.checkAccess(route.url);
  }

  checkAccess(segments: UrlSegment[]): Observable<UrlTree | boolean> | boolean {
    if (this.userAccessOnlyMenu.some(val => segments[0]?.path === val)) {
      return this.authService.checkIsAuthenticated().pipe(
        tap(val => {
          if (!val) {
            this.toastService.error({ text: `You do not have access to menu ${segments[0]?.path}!` });
          }
        })
      );
    } else if (this.anonymousAccessOnlyMenu.some(val => segments[0]?.path === val)) {
      return this.authService.checkIsAnonymous().pipe(
        tap(val => {
          if (!val) {
            this.toastService.error({ text: `You do not have access to menu ${segments[0]?.path}!` });
          }
        })
      );
    } else {
      return true;
    }
  }
}
