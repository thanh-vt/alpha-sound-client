import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongRoutingModule } from './song-routing.module';
import {SongListComponent} from './song-list/song-list.component';
import {SongDetailComponent} from './song-detail/song-detail.component';
import {UploadSongComponent} from './upload-song/upload-song.component';
import {EditSongComponent} from './edit-song/edit-song.component';
import {DeleteSongComponent} from './delete-song/delete-song.component';
import { SongComponent } from './song/song.component';
import {MatAutocompleteModule, MatDatepickerModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NewSongComponent } from './new-song/new-song.component';
import {SharedModule} from '../shared/shared.module';
import {PlaylistModule} from '../playlist/playlist.module';
import { ListenSongComponent } from './listen-song/listen-song.component';

@NgModule({
  declarations: [SongListComponent, SongDetailComponent, UploadSongComponent, EditSongComponent, DeleteSongComponent, SongComponent, NewSongComponent, ListenSongComponent],
  imports: [
    CommonModule,
    SongRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatDatepickerModule,
    NgbModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SharedModule,
    PlaylistModule,
    // AutoSizeInputModule
  ],
  exports: [SongListComponent, SongDetailComponent, UploadSongComponent, EditSongComponent, DeleteSongComponent, SongComponent, NewSongComponent],
})
export class SongModule { }
