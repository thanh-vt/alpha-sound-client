import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AddSongToPlaylistComponent } from './add-song-to-playlist/add-song-to-playlist.component';
import { ModalPlaylistListComponent } from './modal-playlist-list/modal-playlist-list.component';
import {PlaylistListComponent} from './playlist-list/playlist-list.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, PlaylistListComponent, ModalPlaylistListComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, PlaylistListComponent, ModalPlaylistListComponent]
})
export class SharedModule { }
