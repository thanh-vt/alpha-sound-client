import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {UserToken} from './model/userToken';
import {finalize} from 'rxjs/operators';
import {UserService} from './service/user.service';
import {AuthService} from './service/auth.service';
import {LocationStrategy} from '@angular/common';

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event) {
  //   if (sessionStorage.getItem('userToken')) {
  //     const token = JSON.parse(sessionStorage.getItem('userToken')) as UserToken;
  //     this.subscription.add(this.http.post(`${environment.authUrl}/token/revoke/${token.access_token}`, null)
  //       .subscribe(
  //         next => {console.log(JSON.parse(JSON.stringify(next))); },
  //         error => {console.log(JSON.parse(JSON.stringify(error))); },
  //         () => {}));
  //   }
  // }

  constructor(private http: HttpClient, private userService: UserService,
              private authService: AuthService, private location: LocationStrategy) {
    // localStorage.clear();
    // sessionStorage.clear();
    location.onPopState(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    console.log(localStorage);
    console.log(sessionStorage);
    if (localStorage.getItem('sessionToken') && !sessionStorage.getItem('userToken')) {
      const token = JSON.parse(localStorage.getItem('sessionToken')) as UserToken;
      this.subscription.add(this.http.post(`${environment.authUrl}/tokens/revoke/${token.access_token}`, null)
        .pipe(finalize(() => {
          localStorage.removeItem('sessionToken');
        }))
        .subscribe(
          () => {},
          error => {console.log(JSON.parse(JSON.stringify(error))); },
          () => {}));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
