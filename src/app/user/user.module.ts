import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UserRoutingModule} from './user-routing.module';
import {HomeComponent} from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import {SharedModule} from '../shared/shared.module';
import {NgxAudioPlayerModule} from 'ngx-audio-player';



@NgModule({
  declarations: [HomeComponent, LoginComponent, RegisterComponent, UserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    NgxAudioPlayerModule
  ],
  exports: [HomeComponent, LoginComponent, RegisterComponent, UserComponent]
})
export class UserModule { }
