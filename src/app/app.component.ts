import {Component, HostListener} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent {
  subscription: Subscription = new Subscription();

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if (sessionStorage.getItem('userToken')) {
      this.subscription.add(this.http.post(`${environment.authUrl}/token/revoke/${sessionStorage.getItem('userToken')}`, null)
        .subscribe(
          next => {console.log(next); },
          error => {console.log(error); },
          () => {}));
    }
  }

  constructor(private http: HttpClient) {
  }
}
