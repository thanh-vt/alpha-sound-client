import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
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
      Authorization : 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)});
    return this.http.post<UserToken>(`${environment.authUrl}/oauth/token`, params, {headers})
      .pipe(map(userToken => {
        if (rememberMe) {
          localStorage.setItem('userToken', JSON.stringify(userToken));
          localStorage.setItem('rememberMe', userToken.refresh_token);
        } else {
          localStorage.setItem('sessionToken', JSON.stringify(userToken));
          sessionStorage.setItem('userToken', JSON.stringify(userToken));
        }
        this.currentUserTokenSubject.next(userToken);
        this.update.emit(['login', userToken.id]);
        return userToken;
      }));
  }

  rememberLogin() {
    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', localStorage.getItem('rememberMe'));
    const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization : 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)});
    return this.http.post<UserToken>(`${environment.authUrl}/oauth/token`, params, {headers})
      .pipe(map(userToken => {
        if (localStorage.getItem('rememberMe')) {
          localStorage.setItem('userToken', JSON.stringify(userToken));
        } else {
          localStorage.setItem('sessionToken', JSON.stringify(userToken));
          sessionStorage.setItem('userToken', JSON.stringify(userToken));
        }
        this.currentUserTokenSubject.next(userToken);
        this.update.emit(['login', userToken.id]);
        return userToken;
      }));
  }

  logout() {
    if (localStorage.getItem('userToken')) {
      const token = JSON.parse(localStorage.getItem('userToken')) as UserToken;
      this.subscription.add(this.http.post(`${environment.authUrl}/tokens/revoke/${token.access_token}`, null)
        .pipe(finalize(() => {
          localStorage.removeItem('userToken');
          localStorage.removeItem('rememberMe');
        }))
        .subscribe(
          next => {console.log(next); },
          error => {console.log(error); },
          () => {}));
    }
    if (localStorage.getItem('rememberMe')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('rememberMe');
      // this.subscription.add(this.http.post(`${environment.authUrl}/tokens/revoke/${localStorage.getItem('rememberMe')}`, null)
      //   .pipe(finalize(() => {
      //     localStorage.removeItem('userToken');
      //     localStorage.removeItem('rememberMe');
      //   }))
      //   .subscribe(
      //     next => {console.log(next); },
      //     error => {console.log(error); },
      //     () => {}));
    }
    if (sessionStorage.getItem('userToken')) {
      const token = JSON.parse(sessionStorage.getItem('userToken')) as UserToken;
      this.subscription.add(this.http.post(`${environment.authUrl}/tokens/revoke/${token.access_token}`, null)
        .pipe(finalize(() => {
          sessionStorage.removeItem('userToken');
          localStorage.removeItem('sessionToken');
        }))
        .subscribe(
          next => {console.log(JSON.parse(JSON.stringify(next))); },
          error => {console.log(JSON.parse(JSON.stringify(error))); },
          () => {}));
    }
    this.currentUserTokenSubject.next(null);
    this.update.emit('logout');
  }
}
