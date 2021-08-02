import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../shared/shared.module';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { SongModule } from '../song/song.module';
import { NgbButtonsModule, NgbDropdownModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { UploadedSongListComponent } from './uploaded-song-list/uploaded-song-list.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-management/user-profile/user-profile.component';
import { PlaylistModule } from '../playlist/playlist.module';
import { TranslateModule } from '@ngx-translate/core';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { ResetPasswordSubmissionComponent } from './reset-password-submission/reset-password-submission.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    UserComponent,
    UpdateProfileComponent,
    SearchComponent,
    UploadedSongListComponent,
    FavoritesComponent,
    ProfileComponent,
    UserProfileComponent,
    CompleteRegistrationComponent,
    ResetPasswordSubmissionComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    NgxAudioPlayerModule,
    SongModule,
    NgbPaginationModule,
    NgbNavModule,
    FormsModule,
    NgbButtonsModule,
    PlaylistModule,
    TranslateModule,
    NgbDropdownModule
  ],
  exports: [HomeComponent, RegisterComponent, UserComponent, UpdateProfileComponent, SearchComponent]
})
export class UserModule {}
