import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TokenResponse, UserProfile } from '../model/token-response';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(null);
  public currentUser$: Observable<UserProfile> = this.currentUserSubject.asObservable();
  // sessionTimeout = new EventEmitter();
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService, private userProfileService: UserProfileService) {
    const tokenInfo = this.tokenStorageService.accessToken;
    const refreshTokenInfo = this.tokenStorageService.accessToken;
    const currentUser = tokenInfo || refreshTokenInfo ? this.tokenStorageService.currentUser : null;
    this.currentUserSubject.next(currentUser);
    if (currentUser) {
      setTimeout(() => {
        this.userProfileService.getCurrentUserProfile().subscribe(next => {
          this.currentUserValue = next;
        });
      });
    }
  }

  public get currentUserValue(): UserProfile {
    return this.currentUserSubject.value;
  }

  public set currentUserValue(val: UserProfile) {
    this.currentUserSubject.next({ ...this.currentUserValue, ...val });
  }

  login(username: string, password: string, rememberMe: boolean): Observable<UserProfile> {
    const params = new HttpParams().set('username', username).set('password', password).set('grant_type', 'password');
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
    });
    return this.http.post<TokenResponse>(`${environment.authUrl}/oauth/token`, params, { headers }).pipe(
      map(userToken => {
        const userInfo: UserProfile = this.tokenStorageService.storeAccessToken(userToken, rememberMe);
        this.userProfileService.getCurrentUserProfile().subscribe(next => {
          this.currentUserValue = { ...userInfo, ...next };
        });
        return userInfo;
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    const tokenInfo = this.tokenStorageService.accessToken;
    if (!tokenInfo) {
      return;
    }
    this.tokenStorageService.clearToken();
    if (tokenInfo.token?.length <= 36) {
      this.http.delete<Observable<string>>(`${environment.authUrl}/oauth/token/revoke/${tokenInfo.token}`).subscribe();
    }
  }

  checkIsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/is-admin`);
  }

  checkIsAnonymous(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/is-anonymous`);
  }

  checkIsAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/is-authenticated`);
  }

  checkMenuAccess(menu: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/has-access`, { params: { menu } });
  }
}
