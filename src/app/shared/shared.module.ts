import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import {PlaylistModule} from '../playlist/playlist.module';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    PlaylistModule,
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent]
})
export class SharedModule { }
