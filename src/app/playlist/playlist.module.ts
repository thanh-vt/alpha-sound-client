import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { PlaylistComponent } from './playlist/playlist.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import { DeletePlaylistSongComponent } from './delete-playlist-song/delete-playlist-song.component';
import {SharedModule} from '../shared/shared.module';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, DeletePlaylistComponent, PlaylistComponent, DeletePlaylistSongComponent, EditPlaylistComponent],
  imports: [
    CommonModule,
    PlaylistRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  // tslint:disable-next-line:max-line-length
  exports: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, DeletePlaylistComponent, PlaylistComponent, DeletePlaylistSongComponent],
})
export class PlaylistModule { }
