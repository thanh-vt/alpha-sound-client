import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import decode from 'jwt-decode';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  cachedRequests: Array<HttpRequest<any>> = [];
  public getToken(): string {
    if (localStorage.getItem('userToken') != null) {
      return  JSON.parse(localStorage.getItem('userToken')).accessToken;
    } else { return ''; }
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return this.tokenNotExpired(token);
  }

  public tokenNotExpired(token) {
    if (token) {
      // var jwtHelper = new JwtHelperService();
      return !jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }

  }
  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests(): void {}

  login(loginForm) {
    return this.http.post<any>(`${environment.apiUrl}/login`, loginForm);
  }

  logout() {
    // remove user from local storage to suggestSongArtist user out
    localStorage.removeItem('userToken');
  }
}
