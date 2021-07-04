import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {UserModule} from './user/user.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TokenInterceptor} from './helper/token.interceptor';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {PlayingQueueService} from './service/playing-queue.service';
import {JWT_OPTIONS, JwtHelperService, JwtModuleOptions} from '@auth0/angular-jwt';
import {AdminModule} from './admin/admin.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import {registerLocaleData} from '@angular/common';
import {GestureConfig} from '../gesture-config';
import {environment} from '../environments/environment';
import {NotificationInterceptor} from './helper/notification-interceptor';
import {NgxVengeanceLibModule} from 'ngx-vengeance-lib';

registerLocaleData(localeVi);
registerLocaleData(localeEn);

const jwtModuleOptions: JwtModuleOptions = {
  config: {
    // tokenGetter: yourTokenGetter,
    // whitelistedDomains: yourWhitelistedDomains
  }
};

// loader module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${environment.baseHref}/assets/i18n/`, '.json');
}

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    AdminModule,
    UserModule,
    NgxAudioPlayerModule,
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
    NgxVengeanceLibModule,
    // HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    // JwtModule.forRoot(JWT_Module_Options)
  ],
  exports: [TranslateModule],
  providers: [TranslateService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: NotificationInterceptor, multi: true},
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    PlayingQueueService,
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
  ],
  bootstrap: [AppComponent]
})

export class AppRootModule {
}
