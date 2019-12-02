import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserToken} from '../models/userToken';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserTokenSubject: BehaviorSubject<UserToken>;
  public currentUserToken: Observable<UserToken>;
  update = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    this.currentUserTokenSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('userToken')));
    this.currentUserToken = this.currentUserTokenSubject.asObservable();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserTokenSubject.value;
  }

  login(username: string, password: string, rememberMe: boolean) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
         Authorization : 'Basic ' + btoa('fooClientIdPassword:secret')});
    return this.http.post<UserToken>(`${environment.authUrl}?${params}`, null, {headers})
      .pipe(map(userToken => {
        if (rememberMe) {
          localStorage.setItem('userToken', JSON.stringify(userToken));
        } else {
          sessionStorage.setItem('userToken', JSON.stringify(userToken));
        }
        this.currentUserTokenSubject.next(userToken);
        this.update.emit(['login', userToken.id]);
        return userToken;
    }));
  }

  logout() {
    // remove user from local storage to suggestSongArtist user out
    localStorage.removeItem('userToken');
    this.currentUserTokenSubject.next(null);
    this.update.emit('logout');
  }
}
