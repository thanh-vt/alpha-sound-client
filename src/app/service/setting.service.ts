import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Setting } from '../model/setting';
import { environment } from '../../environments/environment';
import { UserProfile } from '../model/token-response';
import { CookieService } from 'ngx-cookie-service';
import { ACCESS_TOKEN_KEY } from './token-storage.service';
import { tap } from 'rxjs/operators';

export const SETTING_KEY = 'setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  setting: Setting = { darkMode: true };
  currentUser: UserProfile;
  private settingSubject: BehaviorSubject<Setting> = new BehaviorSubject(this.setting);
  public setting$: Observable<Setting> = this.settingSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  toggleDarkMode(value: boolean): void {
    this.setting.darkMode = value;
    this.setTheme(value ? 'dark' : 'light');
    this.settingSubject.next(this.setting);
    if (this.cookieService.check(ACCESS_TOKEN_KEY)) {
      localStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
    } else {
      sessionStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
    }
    if (this.currentUser) {
      this.applySetting();
    }
  }

  getSetting(currentUser: UserProfile): Observable<Setting> {
    if (currentUser) {
      return this.http.get<Setting>(`${environment.apiUrl}/setting`).pipe(
        tap(setting => {
          this.setting = { ...this.setting, ...setting };
          this.settingSubject.next(this.setting);
          if (this.cookieService.check(ACCESS_TOKEN_KEY)) {
            localStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
          } else {
            sessionStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
          }
        })
      );
    } else {
      const settingStr = localStorage.getItem(SETTING_KEY) ?? sessionStorage.getItem(SETTING_KEY);
      this.setting = settingStr ? JSON.parse(settingStr) : this.setting;
      this.settingSubject.next(this.setting);
      return of(this.setting);
    }
  }

  applySetting(): void {
    this.http.patch<void>(`${environment.apiUrl}/setting`, this.setting).subscribe(
      () => {
        console.debug('Setting applied successfully.');
      },
      () => {
        console.debug('Failed to apply setting.');
      }
    );
  }

  setTheme(theme: 'dark' | 'light'): void {
    document.body.className = `animate-colors-transition theme-${theme}`;
    setTimeout(() => {
      document.body.classList.remove(`animate-colors-transition`);
    }, 2000);
  }
}
