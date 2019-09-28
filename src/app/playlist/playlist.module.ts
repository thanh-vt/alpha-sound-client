import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { PlaylistComponent } from './playlist/playlist.component';


@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, EditPlaylistComponent, DeletePlaylistComponent, PlaylistComponent],
  imports: [
    CommonModule,
    PlaylistRoutingModule
  ],
  exports: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, EditPlaylistComponent, DeletePlaylistComponent],
})
export class PlaylistModule { }
