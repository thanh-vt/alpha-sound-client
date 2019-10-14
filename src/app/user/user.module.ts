import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserRoutingModule} from './user-routing.module';
import {HomeComponent} from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import {SharedModule} from '../shared/shared.module';
import {NgxAudioPlayerModule} from 'ngx-audio-player';
import { EditComponent } from './edit/edit.component';
import {SongModule} from '../song/song.module';
import {NgbButtonsModule, NgbPaginationModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { UploadedSongListComponent } from './uploaded-song-list/uploaded-song-list.component';
import { FavoriteSongListComponent } from './favorite-song-list/favorite-song-list.component';
import { FavoriteAlbumListComponent } from './favorite-album-list/favorite-album-list.component';

@NgModule({
  declarations: [HomeComponent, RegisterComponent, UserComponent, EditComponent, SearchComponent, UploadedSongListComponent, FavoriteSongListComponent, FavoriteAlbumListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    NgxAudioPlayerModule,
    SongModule,
    NgbPaginationModule,
    NgbTabsetModule,
    FormsModule,
    NgbButtonsModule
  ],
  exports: [HomeComponent, RegisterComponent, UserComponent, EditComponent, SearchComponent, FavoriteSongListComponent, FavoriteAlbumListComponent]
})
export class UserModule { }
