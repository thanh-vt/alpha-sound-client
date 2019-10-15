import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {UserModule} from './user/user.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JwtInterceptor} from './helper/jwt.interceptor';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {AddSongToPlaying} from './service/add-song-to-playling.service';
import {JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';
import {AdminModule} from './admin/admin.module';
import {ErrorInterceptor} from './helper/error.interceptor';

const JWT_Module_Options: JwtModuleOptions = {
  config: {
    // tokenGetter: yourTokenGetter,
    // whitelistedDomains: yourWhitelistedDomains
  }
};
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent
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
    AdminModule,
    ReactiveFormsModule
    // HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    // JwtModule.forRoot(JWT_Module_Options)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    AddSongToPlaying
  ],
  bootstrap: [AppComponent]
})

export class AppRootModule { }
