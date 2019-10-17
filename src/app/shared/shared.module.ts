import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
// import {AddSongToPlaylistComponent} from './add-song-to-playlist/add-song-to-playlist.component';
// import {ModalPlaylistListComponent} from './modal-playlist-list/modal-playlist-list.component';
// import {PlaylistListComponent} from './playlist-list/playlist-list.component';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import {PlaylistModule} from '../playlist/playlist.module';
import { ModalComponent } from './modal/modal.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent, CardComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    PlaylistModule,
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent]
})
export class SharedModule {
}
