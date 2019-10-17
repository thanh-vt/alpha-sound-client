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
  private currentUserSubject: BehaviorSubject<UserToken>;
  public currentUser: Observable<UserToken>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('userToken')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserSubject.value;
  }

  login(loginForm) {
    return this.http.post<any>(`${environment.apiUrl}/login`, loginForm).pipe(map(userToken => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('userToken', JSON.stringify(userToken));
      this.currentUserSubject.next(userToken);
      return userToken;
    }));
  }

  logout() {
    // remove user from local storage to suggestSongArtist user out
    localStorage.removeItem('userToken');
    this.currentUserSubject.next(null);
  }
}
