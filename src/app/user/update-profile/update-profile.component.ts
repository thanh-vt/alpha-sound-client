import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserProfileService} from '../../service/user-profile.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Progress} from '../../model/progress';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {UserProfile} from '../../model/token-response';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  currentUserToken: UserProfile;
  currentUser: UserProfile;
  updateForm: FormGroup;
  loading: boolean;
  submitted = false;
  error: boolean;
  file: any;
  formData = new FormData();
  message: string;
  isImageFileChosen = false;
  imageFileName = '';
  progress: Progress = {value: 0};
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private userService: UserProfileService) {
    this.authService.currentUser$.subscribe(
      next => {
        this.currentUserToken = next;
      }
    );
  }

  ngOnInit() {
    this.subscription.add(this.userService.getCurrentUserProfile().subscribe(
      currentUser => {
        this.currentUser = currentUser;
        this.updateForm = this.fb.group({
          username: [this.currentUser.user_name],
          // tslint:disable-next-line:max-line-length
          password: [this.currentUser.password],
          firstName: [this.currentUser.first_name, [Validators.required,
            Validators.minLength(2), Validators.maxLength(20)]],
          lastName: [this.currentUser.last_name, [Validators.required,
            Validators.minLength(2), Validators.maxLength(20)]],
          phoneNumber: [this.currentUser.phone_number, Validators.required],
          gender: [this.currentUser.gender, Validators.required],
          birthDate: [this.currentUser.date_of_birth, Validators.required],
          email: [this.currentUser.email]
        });
      }, error => {
        console.log(error);
      }
    ));
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChosen = true;
      this.imageFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress: Progress): boolean {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        progress.value = Math.round(event.loaded / event.total * 100);
        console.log(`Uploaded! ${progress.value}%`);
        break;
      case HttpEventType.Response:
        console.log('Song successfully created!', event.body);
        const complete = setTimeout(() => {
          progress.value = 0;
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
            clearTimeout(complete);
          }, 2000);
        }, 500);
        return true;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.formData.append('avatar', this.file);
    if (this.updateForm.valid) {
      this.loading = true;
      this.subscription.add(this.userService.updateProfile(this.updateForm.value)
        .pipe(finalize(() => {
          this.loading = false;
          this.subscription.add(this.userService.getCurrentUserProfile().subscribe(
            currentUser => {
              this.currentUser = currentUser;
            }
          ));
        }))
        .subscribe(
          () => {
            this.error = false;
            this.message = 'Profile updated successfully.';
            if (this.isImageFileChosen) {
              this.subscription.add(this.userService.uploadAvatar(this.formData).subscribe(
                (event: HttpEvent<any>) => {
                  console.log(event);
                  if (this.displayProgress(event, this.progress)) {
                    this.error = false;
                    this.message = 'Avatar uploaded successfully.';
                  }
                },
                error => {
                  this.error = true;
                  this.message = 'Failed to upload avatar.';
                  console.log(error);
                }
              ));
            }
          },
          error => {
            this.error = true;
            this.message = 'Failed to update profile.';
            console.log(error);
          }
        ));
    }
  }

  navigate() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
