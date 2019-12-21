import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';
import {UserToken} from '../models/userToken';
import {Setting} from '../models/setting';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  setting: Setting = {
    darkMode: true
  };
  currentUserToken: UserToken;
  public darkThemeSubject = new BehaviorSubject(this.setting.darkMode);
  public darkThemeSubjectValue = this.darkThemeSubject.asObservable();

  constructor(private http: HttpClient) {
    if (localStorage.getItem('userToken')) {
      this.setting = (JSON.parse(localStorage.getItem('userToken')) as UserToken).setting;
    }
    if (sessionStorage.getItem('userToken')) {
      this.setting = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).setting;
    }
  }

  turnOnDarkMode(value: boolean) {
    this.setting.darkMode = value;
    this.darkThemeSubject.next(this.setting.darkMode);
    if (localStorage.getItem('userToken')) {
      this.currentUserToken = JSON.parse(localStorage.getItem('userToken')) as UserToken;
      this.currentUserToken.setting = this.setting;
      localStorage.setItem('userToken', JSON.stringify(this.currentUserToken));
    }
    if (sessionStorage.getItem('userToken')) {
      this.setting = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).setting;
      this.currentUserToken.setting = this.setting;
      sessionStorage.setItem('userToken', JSON.stringify(this.currentUserToken));
    }
    this.http.post(`${environment.apiUrl}/setting`, this.setting).subscribe(
      value1 => {console.log(value1); },
      error1 => {console.log(error1); }
    );
  }
}
