import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserToken} from '../../model/userToken';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User;
  message: string;
  isCollapsed: boolean;
  loginForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  subscription = new Subscription();

  @ViewChild('language', {static: false}) language: ElementRef;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
              private userService: UserService, private fb: FormBuilder, public translate: TranslateService) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    // localStorage.clear();
    this.loginForm = this.fb.group({
      username: ['',  Validators.required],
      password: ['',  Validators.required]
    });
    this.searchForm = this.fb.group({
      searchText: ['',  Validators.required]
    });
    this.isCollapsed = true;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSignIn() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.valid) {
      this.loading = true;
      this.subscription.add(this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        }, () => {
          this.message = 'Wrong username or password';
        }, () => {
          this.loading = false;
        }
      ));
    }
  }

  onSearch() {
    if (this.searchForm.invalid) { return; }
    const searchText = this.searchForm.get('searchText').value;
    // tslint:disable-next-line:only-arrow-functions
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.router.navigate(['/', 'search'], { queryParams: { name: searchText } });
  }

  logout() {
    this.authService.logout();
    const navigation = setTimeout(
      () => {
      this.router.navigate(['/home']);
      clearTimeout(navigation);
    }, 500);
  }

  translatePage() {
    this.translate.use(this.language.nativeElement.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
