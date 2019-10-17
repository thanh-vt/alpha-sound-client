import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { ModalComponent } from './modal/modal.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent, CardComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent, AddSongToPlaylistComponent, ModalComponent, CardComponent]
})
export class SharedModule {
}
