import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';
import { VgControlModule } from 'ngx-vengeance-lib';

@NgModule({
  declarations: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, PlaylistComponent, EditPlaylistComponent],
  imports: [CommonModule, PlaylistRoutingModule, NgbModule, ReactiveFormsModule, SharedModule, VgControlModule],
  exports: [PlaylistListComponent, PlaylistDetailComponent, CreatePlaylistComponent, PlaylistComponent]
})
export class PlaylistModule {}
