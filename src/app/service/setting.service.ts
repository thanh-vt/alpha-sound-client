import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Setting } from '../model/setting';
import { environment } from '../../environments/environment';
import { UserProfile } from '../model/token-response';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ACCESS_TOKEN_KEY } from './token-storage.service';

export const SETTING_KEY = 'setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  setting: Setting = { darkMode: true };
  currentUser: UserProfile;
  private settingSubject: BehaviorSubject<Setting> = new BehaviorSubject(this.setting);
  public setting$: Observable<Setting> = this.settingSubject.asObservable();
  subscriptions: Subscription = new Subscription();

  constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(next => {
        this.currentUser = next;
        if (this.currentUser) {
          this.getSetting().subscribe(next1 => {
            this.setting = { ...this.setting, ...next1 };
            this.settingSubject.next(this.setting);
            if (this.cookieService.check(ACCESS_TOKEN_KEY)) {
              localStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
            } else {
              sessionStorage.setItem(SETTING_KEY, JSON.stringify(this.setting));
            }
          });
        }
      })
    );
    setTimeout(() => {
      document.body.classList.add(`animate-colors-transition`);
    }, 500);
    this.setTheme('dark');
  }

  turnOnDarkMode(value: boolean) {
    this.setting.darkMode = value;
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

  getSetting(): Observable<Setting> {
    return this.http.get<Setting>(`${environment.apiUrl}/setting`);
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
    document.body.classList.add(`theme-${theme}`);
  }
}
