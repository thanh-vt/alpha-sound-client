import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { UserProfileService } from '../../../service/user-profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../../model/token-response';
import { Setting } from '../../../model/setting';
import { SettingService } from '../../../service/setting.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../component/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserProfile;
  setting$: Observable<Setting>;
  isCollapsed: boolean;
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  searchForm: FormGroup = this.fb.group({
    searchText: ['', Validators.required]
  });
  loading = false;
  returnUrl: string;
  isAdmin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserProfileService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private settingService: SettingService,
    private modalService: NgbModal,
    private toastService: VgToastService,
    private loadingService: VgLoaderService
  ) {
    // const currentLanguage = this.translate.getBrowserLang();
    // translate.setDefaultLang(currentLanguage);
    // translate.use(currentLanguage);
    this.authService.currentUser$.subscribe(async next => {
      this.currentUser = next;
      if (this.currentUser) {
        this.isAdmin = await this.authService.checkIsAdmin().toPromise();
      }
    });
    this.setting$ = this.settingService.setting$;
  }

  ngOnInit(): void {
    this.isCollapsed = true;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSignIn(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password, rememberMe } = this.loginForm.value;
      this.authService
        .login(username, password, rememberMe)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(() => {
          this.toastService.success({ text: this.translate.instant('feature.account.login_success') });
          const redirectToHome = setTimeout(() => {
            this.router.navigate([this.returnUrl]);
            clearTimeout(redirectToHome);
          }, 1500);
        });
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }
    const searchText = this.searchForm.get('searchText').value;
    // this.router.routeReuseStrategy.shouldReuseRoute = () => true;
    this.router.navigate(['/', 'search'], { queryParams: { q: searchText } });
  }

  openLogoutConfirmDialog(): void {
    const dialogRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = dialogRef.componentInstance;
    comp.subject = this.translate.instant('feature.account.confirm_logout');
    comp.name = '';
    comp.data = true;
    comp.confirmDelete = false;
    const sub: Subscription = dialogRef.closed.subscribe(result => {
      sub.unsubscribe();
      if (result) {
        this.authService.logout();
        this.loadingService.loading(true);
        const navigation = setTimeout(() => {
          this.loadingService.loading(false);
          this.router.navigate(['/home']);
          clearTimeout(navigation);
        }, 3000);
      }
    });
  }

  turnDarkThemeOnOff(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.settingService.toggleDarkMode(target.value == '2');
  }

  changeLang(lang: string): void {
    this.translate.use(lang);
  }
}
