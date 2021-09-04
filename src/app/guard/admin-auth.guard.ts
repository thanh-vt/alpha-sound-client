import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { VgToastService } from 'ngx-vengeance-lib';
import { tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivateChild {
  constructor(private router: Router, private authService: AuthService, private toastService: VgToastService) {}

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree | boolean> | boolean {
    if (next.children[0]?.url?.length) {
      return this.checkAccess(next.children[0]?.url);
    } else {
      return true;
    }
  }

  checkAccess(segments: UrlSegment[]): Observable<UrlTree | boolean> {
    return this.authService.checkMenuAccess(segments[0]?.path).pipe(
      tap(val => {
        if (!val) {
          this.toastService.error({ text: `You do not have access to admin menu ${segments[0]?.path}!` });
        }
      })
    );
  }
}
