import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {TokenResponse, UserProfile} from '../model/token-response';
import {environment} from '../../environments/environment';

export const USER_INFO = 'user_info';
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private cookieService: CookieService) {
  }

  get accessToken(): { token: string; mode: 'header' | 'cookie' } {
    return this.getToken(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): { token: string; mode: 'header' | 'cookie' } {
    return this.getToken(REFRESH_TOKEN_KEY);
  }

  get currentUser(): UserProfile {
    let userInfo: UserProfile = JSON.parse(localStorage.getItem(USER_INFO));
    if (!userInfo) {
      userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));
    }
    return userInfo;
  }

  private static extractUserInfo(tokenResponse: TokenResponse): UserProfile {
    const {
      user_name,
      first_name,
      last_name,
      gender,
      roles,
      authorities,
      avatar_url,
      date_of_birth,
    } = tokenResponse;
    return {
      user_name,
      first_name,
      last_name,
      gender,
      roles,
      authorities,
      avatar_url,
      date_of_birth,
    };
  }

  setToken(key: string, value: string, rememberMe?: boolean): void {
    if (rememberMe) {
      if (environment.credMode === 'cookie') {
        this.cookieService.set(key, value, {
          expires: 1,
          path: '/',
          domain: null,
          secure: true,
          sameSite: 'None'
        });
      } else {
        localStorage.setItem(key, value);
      }
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  getToken(key: string): { token: string; mode: 'cookie' | 'header'; } {
    let tokenInfo: { token: string; mode: 'cookie' | 'header'; };
    if (environment.credMode === 'cookie') {
      tokenInfo = {token: this.cookieService.get(key), mode: 'cookie'};
    } else if (environment.credMode === 'header') {
      tokenInfo = {token: localStorage.getItem(key), mode: 'header'};
    } else {
      tokenInfo = {token: sessionStorage.getItem(key), mode: 'header'};
    }
    if (tokenInfo.token) {
      return tokenInfo;
    } else {
      return null;
    }
  }

  isRememberMe(): boolean {
    if (environment.credMode === 'cookie') {
      return this.cookieService.check(ACCESS_TOKEN_KEY) || this.cookieService.check(REFRESH_TOKEN_KEY);
    } else if (environment.credMode === 'header') {
      return !!localStorage.getItem(ACCESS_TOKEN_KEY) || !!localStorage.getItem(REFRESH_TOKEN_KEY);
    } else {
      return !!sessionStorage.getItem(ACCESS_TOKEN_KEY) || !!sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
  }

  storeAccessToken(tokenResponse: TokenResponse, rememberMe?: boolean): UserProfile {
    const userInfo = TokenStorageService.extractUserInfo(tokenResponse);
    this.setToken(ACCESS_TOKEN_KEY, tokenResponse.access_token, rememberMe);
    this.setToken(REFRESH_TOKEN_KEY, tokenResponse.refresh_token, rememberMe);
    if (rememberMe) {
      localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    } else {
      sessionStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    }
    return userInfo;
  }

  storeRefreshToken(tokenResponse: TokenResponse): UserProfile {
    const userInfo = TokenStorageService.extractUserInfo(tokenResponse);
    const isRememberMe: boolean = this.isRememberMe();
    this.setToken(ACCESS_TOKEN_KEY, tokenResponse.access_token, isRememberMe);
    this.setToken(REFRESH_TOKEN_KEY, tokenResponse.refresh_token, isRememberMe);
    if (isRememberMe) {
      localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    } else {
      sessionStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    }
    return userInfo;
  }

  clearToken(): void {
    if (this.cookieService.check(ACCESS_TOKEN_KEY)) {
      this.cookieService.delete(ACCESS_TOKEN_KEY, '/');
      this.cookieService.delete(REFRESH_TOKEN_KEY, '/');
      localStorage.removeItem(USER_INFO);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_INFO);
    }
  }
}
