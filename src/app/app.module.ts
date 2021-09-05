import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { UserModule } from './user/user.module';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptor } from './helper/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './admin/admin.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { GestureConfig } from '../gesture-config';
import { NotificationInterceptor } from './helper/notification-interceptor';
import { VgLoaderModule, VgToastModule, VgUtilModule } from 'ngx-vengeance-lib';
import { NgbDateCustomParserFormatter } from './helper/ngb-date-custom-parser-formatter';
import { CustomNgbDateAdapter } from './helper/custom-ngb-date-adapter';

registerLocaleData(localeVi);
registerLocaleData(localeEn);

// loader module
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    AdminModule,
    UserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    VgToastModule.forRoot(),
    VgLoaderModule,
    HammerModule,
    VgUtilModule

    // HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
  ],
  exports: [TranslateModule],
  providers: [
    TranslateService,
    { provide: HTTP_INTERCEPTORS, useClass: NotificationInterceptor, multi: true }, // order 2
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // order 1
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppRootModule {}
