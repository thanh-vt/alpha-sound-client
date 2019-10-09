import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AddSongToPlaylistComponent } from './add-song-to-playlist/add-song-to-playlist.component';
import {PlaylistModule} from '../playlist/playlist.module';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    PlaylistModule,
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent]
})
export class SharedModule { }
