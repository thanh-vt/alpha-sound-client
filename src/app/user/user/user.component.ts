import { Component } from '@angular/core';
import { SettingService } from '../../service/setting.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  subscriptions: Subscription = new Subscription();

  constructor(private settingService: SettingService, private authService: AuthService) {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(next => {
        this.settingService.getSetting(next).subscribe(setting => {
          this.settingService.setTheme(setting.darkMode ? 'dark' : 'light');
        });
      })
    );
  }
}
