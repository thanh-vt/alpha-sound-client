import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = false;
  file: File;
  message: string;
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private userService: UserService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      // tslint:disable-next-line:max-line-length
      // password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$'), Validators.minLength(6) ]],
      password: ['', [Validators.required, Validators.minLength(6) ]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phoneNumber: ['', Validators.required],
      gender: [true, Validators.required],
      birthDate: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  ngOnInit() {

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.subscription.add(this.userService.register(this.registerForm.value).subscribe(
        () => {
          this.error = false;
          this.message = 'User registered successfully!';
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
          }, 3000);
        },
        error => {
          this.error = true;
          this.message = 'Failed to register. Cause: ' + error.message;
        }
      ));
    }
  }
  navigate() {
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


