import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { SettingService } from '../../service/setting.service';
import { UserProfileService } from '../../service/user-profile.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  active: string;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngbModal: NgbModal,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    public translate: TranslateService,
    private settingService: SettingService
  ) {
    // const currentLanguage = this.translate.getBrowserLang();
    // translate.setDefaultLang(currentLanguage);
    // translate.use(currentLanguage);
    this.authService.currentUser$.subscribe(async next => {
      if (next) {
        this.isAdmin = await this.authService.checkIsAdmin().toPromise();
      } else {
        this.isAdmin = false;
      }
    });
  }

  ngOnInit(): void {
    this.active = this.router.url;
    this.settingService.setTheme('light');
  }

  signOut(): void {
    this.authService.logout();
  }

  popLoginFormUp(event): void {
    const ref = this.ngbModal.open(LoginComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
