import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {UserRoutingModule} from './user-routing.module';
import {HomeComponent} from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import {SharedModule} from '../shared/shared.module';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import { EditComponent } from './edit/edit.component';
import {SongModule} from '../song/song.module';



@NgModule({
  declarations: [HomeComponent, RegisterComponent, UserComponent, EditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    NgxAudioPlayerModule,
    SongModule
  ],
  exports: [HomeComponent, RegisterComponent, UserComponent]
})
export class UserModule { }
