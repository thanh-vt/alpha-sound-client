import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../service/admin.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() adminLoginAction = new EventEmitter();
  currentUser: User;
  adminLoginForm: FormGroup;
  submitted = false;
  loading = false;
  message: string;
  error = false;
  returnUrl: string;
  userId: number;
  subscription: Subscription = new Subscription();

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private adminService: AdminService, private authService: AuthService, private userService: UserService) {
    this.authService.currentUserToken.subscribe(
      next => {this.userService.getProfile(next.id).subscribe(
        currentUser => {
          this.currentUser = currentUser;
        }
      ); }
    );
  }

  ngOnInit() {
    this.submitted = false;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/admin';
    this.adminLoginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.adminLoginForm.invalid) {
      return;
    }
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.subscription.add(this.authService.login(this.adminLoginForm.get('username').value, this.adminLoginForm.get('password').value, this.adminLoginForm.get('rememberMe').value)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
      (next) => {
        this.userId = next.id;
        this.userService.getProfile(this.userId).subscribe(
          currentUser => {
            let hasRoleAdmin = false;
            const roleList = currentUser.roles;
            for (const role of roleList) {
              if (role.authority === 'ROLE_ADMIN') {
                hasRoleAdmin = true;
                break;
              }
            }
            if (hasRoleAdmin) {
              this.error = false;
              this.message = '';
              this.adminLoginAction.emit();
              this.router.navigate(['/admin']);
            } else {
              this.error = true;
              this.authService.logout();
              this.message = 'Your account is not an Administrator account';
            }
            this.submitted = false;
          }
        );
      }, error => {
        this.error = true;
        if (error.statusCode === 400) {
          this.message = 'Wrong username or password';
        } else {
          this.message = 'Oop!!! An error has occurred';
        }
      }, () => {
        this.loading = false;
        console.log(localStorage);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
