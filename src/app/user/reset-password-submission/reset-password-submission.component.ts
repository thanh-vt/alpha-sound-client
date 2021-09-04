import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../../service/user-profile.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-reset-password-submission',
  templateUrl: './reset-password-submission.component.html',
  styleUrls: ['./reset-password-submission.component.scss']
})
export class ResetPasswordSubmissionComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading: boolean;
  status: number;
  id: number;
  passwordResetToken: string;
  countdownSec$: number;
  @ViewChild('successResetRef') successResetRef: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UserProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    private toastService: VgToastService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        email: [null],
        token: [null],
        oldPassword: [null],
        newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        repeatedNewPassword: ['', Validators.compose([Validators.required])]
      },
      {
        validators: [{ validator: mustMatch('newPassword', 'repeatedNewPassword') }]
      }
    );
  }

  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('token') && queryParamMap.has('email')) {
      const token = queryParamMap.get('token');
      const email = queryParamMap.get('email');
      this.resetPasswordForm.patchValue({
        token,
        email
      });
    } else {
      this.status = -1;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.passwordResetToken) {
      this.loading = true;
      this.userService
        .resetPasswordSubmission(this.resetPasswordForm.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          () => {
            this.toastService.success({ text: 'Password reset successfully' }, { type: TOAST_TYPE.SUCCESS });
            this.status = 1;
            this.countdownSec$ = 5;
            const countdown = setInterval(() => {
              if (this.countdownSec$ === 0) {
                clearInterval(countdown);
                this.router.navigate(['/home']);
              } else {
                this.countdownSec$ = --this.countdownSec$;
              }
            }, 1000);
          },
          error => {
            this.status = -1;
            console.error(error);
          }
        );
    }
  }
}

export function mustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
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
