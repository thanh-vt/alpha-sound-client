import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { VgToastService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html'
})
export class AppComponent {
  endpointMap = environment.pingEndpointConfig;

  constructor(private toastService: VgToastService, private translate: TranslateService) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
  }
}
