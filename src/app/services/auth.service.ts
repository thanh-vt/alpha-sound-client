import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {UserToken} from '../models/userToken';
import {finalize, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserTokenSubject: BehaviorSubject<UserToken>;
  public currentUserToken: Observable<UserToken>;
  update = new EventEmitter<any>();
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {
    // tslint:disable-next-line:max-line-length
    this.currentUserTokenSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('userToken') ? localStorage.getItem('userToken') : sessionStorage.getItem('userToken')));
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserTokenSubject.value;
  }

  login(username: string, password: string, rememberMe: boolean) {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization : 'Basic ' + btoa('fooClientIdPassword:secret')});
    return this.http.post<UserToken>(`${environment.authUrl}`, params, {headers})
      .pipe(map(userToken => {
        if (rememberMe) {
          localStorage.setItem('userToken', JSON.stringify(userToken));
        } else {
          sessionStorage.setItem('userToken', JSON.stringify(userToken));
        }
        this.currentUserTokenSubject.next(userToken);
        this.update.emit(['login', userToken.id, rememberMe]);
        return userToken;
      }));
  }

  logout() {
    if (localStorage.getItem('userToken')) {
      this.subscription.add(this.http.post(`${environment.authUrl}/token/revoke/${localStorage.getItem('userToken')}`, null)
        .pipe(finalize(() => {
          localStorage.removeItem('userToken');
        }))
        .subscribe(
          next => {console.log(next); },
          error => {console.log(error); },
          () => {}));
    }
    if (sessionStorage.getItem('userToken')) {
      sessionStorage.removeItem('userToken');
      this.subscription.add(this.http.post(`${environment.authUrl}/token/revoke/${sessionStorage.getItem('userToken')}`, null)
        .pipe(finalize(() => {
          sessionStorage.removeItem('userToken');
        }))
        .subscribe(
          next => {console.log(next); },
          error => {console.log(error); },
          () => {}));
    }
    this.currentUserTokenSubject.next(null);
    this.update.emit('logout');
  }
}
