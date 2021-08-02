import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './component/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { ModalComponent } from './component/modal/modal.component';
import { CardComponent } from './component/card/card.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { EnvPipe } from './pipe/env.pipe';
import { ToastComponent } from './component/toast/toast.component';
import { ConfirmationModalComponent } from './component/modal/confirmation-modal/confirmation-modal.component';
import { CommonModalComponent } from './component/modal/common-modal/common-modal.component';
import { LoadingComponent } from './layout/loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    ModalComponent,
    CardComponent,
    SpinnerComponent,
    EnvPipe,
    LoadingComponent,
    ToastComponent,
    CommonModalComponent,
    ConfirmationModalComponent
  ],
  imports: [CommonModule, NgbModule, RouterModule, ReactiveFormsModule, TranslateModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    ModalComponent,
    CardComponent,
    SpinnerComponent,
    EnvPipe,
    ToastComponent
  ]
})
export class SharedModule {}
