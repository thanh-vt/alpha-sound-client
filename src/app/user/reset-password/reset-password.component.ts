import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../service/user.service';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  getPasswordResetTokenForm: FormGroup;
  submitted: boolean;
  subscription: Subscription = new Subscription();
  message: string;
  error: boolean;
  loading: boolean;

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getPasswordResetTokenForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.getPasswordResetTokenForm.valid) {
      this.loading = true;
      this.subscription.add(this.userService.getPasswordResetToken(this.getPasswordResetTokenForm.value)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe(
          next => {
            this.error = false;
            this.message = 'We\'ve sent you an email. Please check it and click the given URL to complete password reset!';
          }, error => {
            this.error = true;
            this.message = 'Failed to send email';
            console.log(error);
          }
        ));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
