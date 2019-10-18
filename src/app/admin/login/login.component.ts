import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../service/admin.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() adminLoginAction = new EventEmitter();
  adminLoginForm: FormGroup;
  submitted = false;
  loading = false;
  message: string;
  error = false;
  returnUrl: string;
  subscription: Subscription = new Subscription();

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private adminService: AdminService, private authService: AuthService ) { }

  ngOnInit() {
    this.submitted = false;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/admin';
    this.adminLoginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.adminLoginForm.invalid) {
      return;
    }
    this.loading = true;
    this.subscription.add(this.adminService.adminLogin(this.adminLoginForm.value).subscribe(
      result => {
        let hasRoleAdmin = false;
        const roleList = result.roles;
        for (const role of roleList) {
          if (role.name === 'ROLE_ADMIN') {
            hasRoleAdmin = true;
            break;
          }
        }
        if (hasRoleAdmin) {
          this.error = false;
          this.message = '';
          localStorage.setItem('userToken', JSON.stringify(result));
          this.adminLoginAction.emit();
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = true;
          this.authService.logout();
          this.message = 'Your account is not an Administrator account';
        }
        this.submitted = false;
      }, error => {
        this.error = true;
        if (error.statusCode === 400) {
          this.message = 'Wrong username or password';
        } else {
          this.message = 'Oop!!! An error has occurred';
        }
      }, () => {
        this.loading = false;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
