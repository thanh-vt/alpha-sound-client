import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {map} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() loginAction = new EventEmitter<string>();
  @Output() logoutAction = new EventEmitter();
  isCollapsed: boolean;
  @Input() isLoggedIn: boolean;
  @Input() username: string;
  id: number;
  loginForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['',  Validators.required],
      password: ['',  Validators.required]
    });
    this.searchForm = this.fb.group({
      searchText: ['',  Validators.required]
    });
    this.isCollapsed = true;
    this.isLoggedIn = (this.authService.currentUserValue != null);
    if (this.isLoggedIn) {
      this.userService.getProfile().subscribe(user => {
          this.username = user.username;
          this.id = user.id;
        }
      );
    }
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSignIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      user => {
        this.username = user.username;
        this.loginAction.emit(this.username);
        this.router.navigate([this.returnUrl]);
      }, error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  onSearch() {

  }

  logoutClick() {
    this.logoutAction.emit();
  }

}
