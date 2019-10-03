import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group({
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

  onSubmit() {
    console.log(this.registerForm.value);
    this.userService.createUser(this.registerForm.value).subscribe(
      result => {
        this.message = 'User created successfully!';
      },
      error => {
        this.message = 'Failed to create user. Cause: ' + error.message;
      }
    );
  }
}


