import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../../service/user-profile.service';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { DateUtil } from '../../util/date-util';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit {
  currentUserToken: UserProfile;
  currentUser: UserProfile;
  updateForm: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    phone_number: ['', Validators.required],
    gender: [null, Validators.required],
    date_of_birth: [null, Validators.required],
    email: [''],
    avatar_url: ['']
  });
  loading: boolean;
  formData = new FormData();
  minDate = DateUtil.getMinDate();
  maxDate = DateUtil.getMaxDate();
  @Output() updateEvent: EventEmitter<UserProfile> = new EventEmitter<UserProfile>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserProfileService,
    private authService: AuthService,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUserProfile().subscribe(currentUser => {
      this.currentUser = currentUser;
      this.updateForm.patchValue(this.currentUser);
    });
  }

  onSubmit(): void {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      this.loading = true;
      const formVal = { ...this.currentUser, ...this.updateForm.value };
      delete formVal.avatar;
      this.formData.set('profile', JSON.stringify(formVal));
      this.userService
        .updateProfile(this.formData)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(next => {
          this.currentUser = next.type === HttpEventType.Response ? next.body : this.currentUser;
          this.authService.currentUserValue = this.currentUser;
          this.updateEvent.emit(this.currentUser);
          this.toastService.show({ text: 'Profile updated successfully' }, { type: TOAST_TYPE.SUCCESS });
        });
    }
  }

  navigate(): void {
    this.router.navigate(['/']);
  }
}
