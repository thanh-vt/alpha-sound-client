import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserToken} from '../../model/userToken';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';

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

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private fb: FormBuilder) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    // localStorage.clear();
    console.log(localStorage);
    console.log(this.currentUser);
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
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.subscription.add(this.authService.login(this.loginForm.value).subscribe(
      () => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      }, () => {
        this.message = 'Wrong username or password';
        this.loading = false;
      }
    ));
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
