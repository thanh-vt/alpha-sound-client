import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset-password-submission',
  templateUrl: './reset-password-submission.component.html',
  styleUrls: ['./reset-password-submission.component.scss']
})
export class ResetPasswordSubmissionComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  submitted: boolean;
  subscription: Subscription = new Subscription();
  message: string;
  error: boolean;
  loading: boolean;
  status: number;
  id: number;
  passwordResetToken: string;

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      next => {
        this.status = parseInt(next.status, 10);
        if (this.status === 0) {
          this.error = false;
          this.id = next.id;
          this.passwordResetToken = next.token;
        } else if (this.status === 1) {
          this.message = 'Invalid Token';
          this.error = true;
        } else if (this.status === 2) {
          this.message = 'Token Expired';
          this.error = true;
        } else {
          this.message = '';
        }
      }, error => {
        console.log(error);
        this.error = true;
      }
    );
    this.resetPasswordForm = this.fb.group({
      oldPassword: [null],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      repeatedNewPassword: ['', Validators.compose([Validators.required])]
    }, {validator: MustMatch('newPassword', 'repeatedNewPassword')});
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.valid && this.passwordResetToken) {
      this.loading = true;
      this.subscription.add(this.userService.resetPasswordSubmission(this.resetPasswordForm.value, this.id, this.passwordResetToken)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe(
          next => {
            this.error = false;
            this.message = 'Password reset successfully.';
          }, error => {
            this.error = true;
            this.message = 'Failed to reset password.';
            console.log(error);
          }
        ));
    }
  }

  passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (this.resetPasswordForm && (control.value !== this.resetPasswordForm.controls.repeatedPassword.value)) {
      return { passwordNotMatch: true };
    } else { return null; }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value && matchingControl) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
