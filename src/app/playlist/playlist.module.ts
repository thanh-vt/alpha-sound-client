import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteSongFromPlaylistComponent } from './delete-song-from-playlist/delete-song-from-playlist';
import { SharedModule } from '../shared/shared.module';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';
import { TranslateModule } from '@ngx-translate/core';
import { VgControlModule } from 'ngx-vengeance-lib';

@NgModule({
  // eslint-disable-next-line max-len
  declarations: [
    PlaylistListComponent,
    PlaylistDetailComponent,
    CreatePlaylistComponent,
    DeletePlaylistComponent,
    PlaylistComponent,
    DeleteSongFromPlaylistComponent,
    EditPlaylistComponent
  ],
  imports: [CommonModule, PlaylistRoutingModule, NgbModule, ReactiveFormsModule, SharedModule, TranslateModule, VgControlModule],
  // eslint-disable-next-line max-len
  exports: [
    PlaylistListComponent,
    PlaylistDetailComponent,
    CreatePlaylistComponent,
    DeletePlaylistComponent,
    PlaylistComponent,
    DeleteSongFromPlaylistComponent
  ]
})
export class PlaylistModule {}
