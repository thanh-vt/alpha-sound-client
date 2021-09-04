import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../model/token-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit {
  currentUser: UserProfile;
  hasNotLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();
  active: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngbModal: NgbModal,
    private authService: AuthService,
    public translate: TranslateService,
    private settingService: SettingService
  ) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.subscription.add(
      this.authService.currentUser$.subscribe(next => {
        this.currentUser = next;
      })
    );
  }

  ngOnInit(): void {
    this.active = this.router.url;
    this.settingService.setTheme('light');
  }

  signOut() {
    this.hasNotLoggedInAsAdmin = true;
    this.authService.logout();
  }

  popLoginFormUp(event) {
    const ref = this.ngbModal.open(LoginComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
  }
}
