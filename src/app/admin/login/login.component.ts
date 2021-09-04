import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserProfileService } from '../../service/user-profile.service';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() adminLoginAction = new EventEmitter();
  currentUser: UserProfile;
  adminLoginForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
    private userService: UserProfileService
  ) {
    this.authService.currentUser$.subscribe(() => {
      this.userService.getCurrentUserProfile().subscribe(currentUser => {
        this.currentUser = currentUser;
      });
    });
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
    const { username, password, rememberMe } = this.adminLoginForm.value;
    this.authService
      .login(username, password, rememberMe)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {},
        error => {
          console.error(error);
        },
        () => {
          this.loading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
