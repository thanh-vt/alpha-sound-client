import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Progress} from '../../model/progress';
import {User} from '../../model/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  currentUser: User;
  updateForm: FormGroup;
  loading: boolean;
  submitted = false;
  returnUrl: string;
  error: boolean;
  file: any;
  formData = new FormData();
  message: string;
  isImageFileChosen = false;
  imageFileName = '';
  progress: Progress = {value: 0};
  subscription: Subscription = new Subscription();

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private userService: UserService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      username: [this.currentUser.username],
      // tslint:disable-next-line:max-line-length
      password: [this.currentUser.password, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')]],
      firstName: [this.currentUser.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phoneNumber: [this.currentUser.phoneNumber, Validators.required],
      gender: [this.currentUser.gender, Validators.required],
      birthDate: [this.currentUser.birthDate, Validators.required],
      email: [this.currentUser.email]
    });
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
    this.formData.append('avatar', this.file);
    this.subscription.add(this.userService.updateProfile(this.updateForm.value).subscribe(
      () => {
        this.error = false;
        this.message = 'Profile updated successfully';
        if (this.isImageFileChosen) {
          this.subscription.add(this.userService.uploadAvatar(this.formData).subscribe(
            (event: HttpEvent<any>) => {
              console.log(event);
              if (this.displayProgress(event, this.progress)) {
                this.error = false;
                this.message = 'Avatar uploaded successfully';
              }
            },
            error => {
              console.log(error);
              this.error = true;
              this.message = 'Failed to upload avatar';
            }, () => {
              this.userService.setProfile();
            }
          ));
        } else {
          this.userService.getProfile().subscribe(
            currentUser => {
              this.currentUser = currentUser;
            }
          );
        }
      },
      error => {
        console.log(error);
        this.error = true;
        this.message = 'Failed to update profile';
      }
    ));
  }

  navigate() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
