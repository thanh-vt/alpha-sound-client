import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { UserModule } from './user/user.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptor } from './helper/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayingQueueService } from './service/playing-queue.service';
import { AdminModule } from './admin/admin.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { GestureConfig } from '../gesture-config';
import { NotificationInterceptor } from './helper/notification-interceptor';
import { VgLoaderModule, VgToastModule } from 'ngx-vengeance-lib';
import { AppLoaderModule } from './shared/layout/loading/app-loader.module';

registerLocaleData(localeVi);
registerLocaleData(localeEn);

// loader module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}

// @ts-ignore
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    AdminModule,
    UserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HammerModule,
    VgLoaderModule,
    AppLoaderModule,
    VgToastModule.forRoot()
    // HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
  ],
  exports: [TranslateModule],
  providers: [
    TranslateService,
    PlayingQueueService,
    { provide: HTTP_INTERCEPTORS, useClass: NotificationInterceptor, multi: true }, // order 2
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // order 1
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppRootModule {}
