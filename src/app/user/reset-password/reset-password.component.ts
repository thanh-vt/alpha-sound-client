import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../../service/user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  getPasswordResetTokenForm: FormGroup;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserProfileService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private toastService: VgToastService
  ) {}

  ngOnInit() {
    this.getPasswordResetTokenForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  onSubmit() {
    if (this.getPasswordResetTokenForm.valid) {
      this.loading = true;
      this.userService
        .getPasswordResetToken(this.getPasswordResetTokenForm.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(_ => {
          this.toastService.show({ text: this.translateService.instant('feature.resetPassword.successMsg') }, { type: TOAST_TYPE.INFO });
        });
    }
  }
}
