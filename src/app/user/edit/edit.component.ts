import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  file: File;
  formData = new FormData();
  message: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: [1, Validators.required],
      birthDate: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  onSubmit() {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(this.updateForm);
    this.userService.updateUser(this.updateForm.value, id).subscribe(
      result => {
        this.message = 'Song created successfully!';
        this.formData.append('id', String(result));
        this.formData.append('avatar', this.file);
        this.userService.uploadUserAvatar(this.formData).subscribe(
          (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;

              case HttpEventType.Response:
                console.log('User successfully updated!', event.body);
            }
            this.message = 'Avatar uploaded successfully!';
          },
          error1 => {
            this.message = 'Failed to upload avatar. Cause: ' + error1.message;
          }
        );
      }, error => {
        this.message = 'Failed to update user. Cause: ' + error.message;
      }
    );
  }

}
