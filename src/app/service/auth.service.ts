import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {UserToken} from '../model/userToken';
import {finalize, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserTokenSubject: BehaviorSubject<UserToken>;
  public currentUserToken: Observable<UserToken>;
  sessionTimeout = new EventEmitter();
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {
    // tslint:disable-next-line:max-line-length
    this.currentUserTokenSubject = new BehaviorSubject<UserToken>(JSON.parse(sessionStorage.getItem('userToken') ? sessionStorage.getItem('userToken') : localStorage.getItem('userToken')));
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
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.setItem('sessionToken', JSON.stringify(userToken));
          sessionStorage.setItem('userToken', JSON.stringify(userToken));
        }
        this.currentUserTokenSubject.next(userToken);
        return userToken;
      }));
  }

  logout() {
    let token: string;
    if (localStorage.getItem('userToken')) {
      token = (JSON.parse(localStorage.getItem('userToken')) as UserToken).access_token;
    }
    if (sessionStorage.getItem('userToken')) {
      token = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).access_token;
    }
    this.http.post<Observable<string>>(`${environment.authUrl}/tokens/revoke/${token}`, null)
      .pipe(finalize(() => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('sessionToken');
        sessionStorage.removeItem('userToken');
      }))
      .subscribe(
        () => {},
        error => {console.log(error); },
        () => {});
    this.currentUserTokenSubject.next(null);
  }
}
