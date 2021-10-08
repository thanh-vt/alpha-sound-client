import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../shared/shared.module';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { SongModule } from '../song/song.module';
import { NgbButtonsModule, NgbDropdownModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { UploadedSongListComponent } from './uploaded-song-list/uploaded-song-list.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-management/user-profile/user-profile.component';
import { PlaylistModule } from '../playlist/playlist.module';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { ResetPasswordSubmissionComponent } from './reset-password-submission/reset-password-submission.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VgControlModule, VgDirectivesModule, VgLayoutModule } from 'ngx-vengeance-lib';
import { UploadedAlbumListComponent } from './uploaded-album-list/uploaded-album-list.component';
import { SearchSummaryComponent } from './search/search-summary/search-summary.component';
import { SearchSongTabComponent } from './search/search-song-tab/search-song-tab.component';
import { SearchArtistTabComponent } from './search/search-artist-tab/search-artist-tab.component';
import { SearchAlbumTabComponent } from './search/search-album-tab/search-album-tab.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
    ResetPasswordComponent,
    UploadedAlbumListComponent,
    SearchSummaryComponent,
    SearchSongTabComponent,
    SearchArtistTabComponent,
    SearchAlbumTabComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    SongModule,
    NgbPaginationModule,
    NgbNavModule,
    FormsModule,
    NgbButtonsModule,
    PlaylistModule,
    NgbDropdownModule,
    VgDirectivesModule,
    VgControlModule,
    VgLayoutModule,
    InfiniteScrollModule
  ],
  exports: [HomeComponent, RegisterComponent, UserComponent, UpdateProfileComponent, SearchComponent]
})
export class UserModule {}
