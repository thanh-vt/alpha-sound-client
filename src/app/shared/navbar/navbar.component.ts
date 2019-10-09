import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() loginAction = new EventEmitter<string>();
  @Output() logoutAction = new EventEmitter();
  @Input() isLoggedIn: boolean;
  @Input() username: string;
  userId: number;
  message: string;
  isCollapsed: boolean;
  loginForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private fb: FormBuilder) {

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
    if (this.authService.isAuthenticated()) {
      this.userId = JSON.parse(localStorage.getItem('userToken')).id;
    }
  }

  onSignIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      user => {
        localStorage.setItem('userToken', JSON.stringify(user));
        this.userId = user.id;
        this.loginAction.emit(user.username);
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.message = 'Ten dang nhap hoac mat khau khong chinh xac';
        this.loading = false;
      }
    );
  }

  onSearch() {

  }

  logoutClick() {
    this.logoutAction.emit();
  }

}
