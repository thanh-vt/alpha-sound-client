import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {UserToken} from '../model/user-token';
import {Setting} from '../model/setting';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  setting: Setting;
  currentUserToken: UserToken;
  public darkThemeSubject: BehaviorSubject<Setting>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.setting = new Setting(true);
    this.darkThemeSubject = new BehaviorSubject(this.setting);
    if (!localStorage.getItem('tempSetting')) {
      localStorage.setItem('tempSetting', JSON.stringify({
        darkMode: true
      }));
    }
    this.authService.currentUserToken.subscribe(
      next => {
        this.currentUserToken = next;
      }, error => {
        console.log(error);
      }
    );
    if (localStorage.getItem('userToken')) {
      this.setting = (JSON.parse(localStorage.getItem('userToken')) as UserToken).setting;
    } else if (sessionStorage.getItem('userToken')) {
      this.setting = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).setting;
    } else if (localStorage.getItem('tempSetting')) {
      this.setting = JSON.parse(localStorage.getItem('tempSetting')) as Setting;
    } else {
      this.setting = new Setting(true);
    }
    this.darkThemeSubject.next(this.setting);
  }

  turnOnDarkMode(value: boolean) {
    this.setting.darkMode = value;
    this.darkThemeSubject.next(this.setting);
    if (localStorage.getItem('userToken')) {
      this.currentUserToken.setting.darkMode = this.setting.darkMode;
      localStorage.setItem('userToken', JSON.stringify(this.currentUserToken));
      this.http.post(`${environment.apiUrl}/setting`, this.currentUserToken.setting).subscribe(
        () => {console.log('Setting applied successfully.'); },
        () => {console.log('Failed to apply setting.'); }
      );
    } else if (sessionStorage.getItem('userToken')) {
      this.currentUserToken.setting.darkMode = this.setting.darkMode;
      sessionStorage.setItem('userToken', JSON.stringify(this.currentUserToken));
      this.http.post(`${environment.apiUrl}/setting`, this.currentUserToken.setting).subscribe(
        () => {console.log('Setting applied successfully.'); },
        () => {console.log('Failed to apply setting.'); }
      );
    } else {
      localStorage.setItem('tempSetting', JSON.stringify(this.setting));
    }
  }
}
