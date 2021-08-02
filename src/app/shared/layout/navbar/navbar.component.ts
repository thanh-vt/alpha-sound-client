import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { UserProfileService } from '../../../service/user-profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../../model/token-response';
import { Setting } from '../../../model/setting';
import { SettingService } from '../../../service/setting.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  setting: Setting = { darkMode: true };
  message: string;
  isCollapsed: boolean;
  loginForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: boolean;
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
    private settingService: SettingService
  ) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
    this.settingService.setting$.subscribe(
      next => {
        if (next) {
          this.setting = next;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
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

  onSignIn() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.subscription.add(
        this.authService
          .login(this.loginForm.get('username').value, this.loginForm.get('password').value, this.loginForm.get('rememberMe').value)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.clearMessage();
            })
          )
          .subscribe(
            () => {
              this.loading = false;
              this.error = false;
              this.message = 'Signed in successfully';
              const redirectToHome = setTimeout(() => {
                this.router.navigate([this.returnUrl]);
                clearTimeout(redirectToHome);
              }, 1500);
            },
            e => {
              console.error(e);
              this.error = true;
              this.message = 'Wrong username or password';
            }
          )
      );
    }
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    const searchText = this.searchForm.get('searchText').value;
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigate(['/', 'search'], { queryParams: { name: searchText } });
  }

  logout() {
    this.authService.logout();
    const navigation = setTimeout(() => {
      this.router.navigate(['/home']);
      clearTimeout(navigation);
    }, 3000);
  }

  clearMessage() {
    const clearMessage = setTimeout(() => {
      this.message = '';
      clearTimeout(clearMessage);
    }, 3000);
  }

  translatePage() {
    this.translate.use(this.language.nativeElement.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  turnDarkThemeOnOff() {
    if (this.setting?.darkMode) {
      this.settingService.turnOnDarkMode(false);
    } else {
      this.settingService.turnOnDarkMode(true);
    }
  }
}
