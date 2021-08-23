import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserProfileService } from '../../service/user-profile.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { VgToastService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  loading = false;
  file: File;
  subscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserProfileService,
    private translateService: TranslateService,
    private toastService: VgToastService
  ) {
    const registerSuccessUrl = `${document.location.protocol}'//'${document.location.hostname}${
      document.location.port ? ':' + document.location.port : ''
    }/#/`;
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      // eslint-disable-next-line max-len
      // password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$'), Validators.minLength(6) ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phoneNumber: ['', Validators.required],
      gender: [true, Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      redirectUrl: [registerSuccessUrl]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe(
        () => {
          this.toastService.success({ text: this.translateService.instant('feature.register.successMsg') });
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
          }, 3000);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  navigate() {
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
