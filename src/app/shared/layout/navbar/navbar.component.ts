import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  setting$: Observable<Setting>;
  isCollapsed: boolean;
  loginForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subscription = new Subscription();

  @ViewChild('language') language: ElementRef;

  // eslint-disable-next-line max-len
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserProfileService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private settingService: SettingService,
    private toastService: VgToastService
  ) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
    this.setting$ = this.settingService.setting$;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.searchForm = this.fb.group({
      searchText: ['', Validators.required]
    });
    this.isCollapsed = true;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSignIn(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.subscription.add(
        this.authService
          .login(this.loginForm.get('username').value, this.loginForm.get('password').value, this.loginForm.get('rememberMe').value)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe(() => {
            this.loading = false;
            this.toastService.success({ text: 'Signed in successfully' });
            const redirectToHome = setTimeout(() => {
              this.router.navigate([this.returnUrl]);
              clearTimeout(redirectToHome);
            }, 1500);
          })
      );
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }
    const searchText = this.searchForm.get('searchText').value;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['/', 'search'], { queryParams: { name: searchText } });
  }

  logout(): void {
    this.authService.logout();
    const navigation = setTimeout(() => {
      this.router.navigate(['/home']);
      clearTimeout(navigation);
    }, 3000);
  }

  translatePage(): void {
    this.translate.use(this.language.nativeElement.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  turnDarkThemeOnOff(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.settingService.toggleDarkMode(target.value == '2');
  }
}
