import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {UserToken} from './models/userToken';
import {finalize} from 'rxjs/operators';

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent implements OnInit{
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

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('sessionToken') && !sessionStorage.getItem('userToken')) {
      const token = JSON.parse(localStorage.getItem('sessionToken')) as UserToken;
      this.subscription.add(this.http.post(`${environment.authUrl}/tokens/revoke/${token.access_token}`, null)
        .pipe(finalize(() => {
          localStorage.removeItem('sessionToken');
        }))
        .subscribe(
          next => {
            console.log(JSON.parse(JSON.stringify(next)));
            },
          error => {console.log(JSON.parse(JSON.stringify(error))); },
          () => {}));
    }
    console.log(localStorage);
    console.log(sessionStorage);
  }
}
