import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Song} from '../../model/song';
import {User} from '../../model/user';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() user: User;
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  file: any;
  formData = new FormData();
  message: string;
  isImageFileChoosen = false;
  imageFileName = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      username: [''],
      // tslint:disable-next-line:max-line-length
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phoneNumber: ['', Validators.required],
      gender: [true, Validators.required],
      birthDate: ['', Validators.required],
      email: ['']
    });
    this.userService.getProfile().subscribe(
      result => {
        this.user = result;
        this.updateForm = this.fb.group({
          username: [this.user.username],
          // tslint:disable-next-line:max-line-length
          password: [this.user.password, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')]],
          firstName: [this.user.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
          lastName: [this.user.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
          phoneNumber: [this.user.phoneNumber, Validators.required],
          gender: [this.user.gender, Validators.required],
          birthDate: [this.user.birthDate, Validators.required],
          email: [this.user.email]
        });
      }
      );
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChoosen = true;
      this.imageFileName = event.target.files[0].name;
    }
  }

  onSubmit() {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(this.updateForm.value);
    // this.userService.updateProfile(this.updateForm.value, id).subscribe(
    //   result => {
    //     this.message = 'Song created successfully!';
    //     this.formData.append('id', String(result));
    //     this.formData.append('avatar', this.file);
    //     this.userService.uploadAvatar(this.formData).subscribe(
    //       (event: HttpEvent<any>) => {
    //         switch (event.type) {
    //           case HttpEventType.Sent:
    //             console.log('Request has been made!');
    //             break;
    //           case HttpEventType.ResponseHeader:
    //             console.log('Response header has been received!');
    //             break;
    //
    //           case HttpEventType.Response:
    //             console.log('User successfully updated!', event.body);
    //         }
    //         this.message = 'Avatar uploaded successfully!';
    //       },
    //       error1 => {
    //         this.message = 'Failed to upload avatar. Cause: ' + error1.message;
    //       }
    //     );
    //   }, error => {
    //     this.message = 'Failed to update user. Cause: ' + error.message;
    //   }
    // );
    this.formData.append('user', new Blob([JSON.stringify(this.updateForm.value)], {type: 'application/json'}));
    this.formData.append('avatar', this.file);
    console.log(this.formData);
    this.userService.updateProfile(this.formData, id).subscribe(
      next => {
        console.log('ok');
        this.message = 'Update user success';
      },
      error => {
        console.log('not ok!');
        this.message = 'Failed update user';
      }
    );
  }

}
