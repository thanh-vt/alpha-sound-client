import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserToken} from '../model/userToken';
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
    localStorage.clear();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserTokenSubject.value;
  }

  login(loginForm) {
    console.log(localStorage);
    return this.http.post<UserToken>(`${environment.apiUrl}/login`, loginForm).pipe(map(userToken => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('userToken', JSON.stringify(userToken));
      this.currentUserTokenSubject.next(userToken);
      this.update.emit(['login', userToken.userId]);
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
