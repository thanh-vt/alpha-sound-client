import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './component/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { CardComponent } from './component/card/card.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnvPipe } from './pipe/env.pipe';
import { ConfirmationModalComponent } from './component/modal/confirmation-modal/confirmation-modal.component';
import { ModalWrapperComponent } from './component/modal/modal-wrapper/modal-wrapper.component';
import { VgControlModule, VgDirectivesModule, VgErrorDictService, VgUtilModule } from 'ngx-vengeance-lib';
import { MusicPlayerComponent } from './layout/music-player/music-player.component';
import { DurationPipe } from './layout/music-player/duration.pipe';
import { SongEditCardComponent } from './component/song-edit-card/song-edit-card.component';
import { ArtistAddSuggestionComponent } from './component/artist-add-suggestion/artist-add-suggestion.component';
import { AlbumEditCardComponent } from './component/album-edit-card/album-edit-card.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    CardComponent,
    SpinnerComponent,
    EnvPipe,
    ConfirmationModalComponent,
    ModalWrapperComponent,
    MusicPlayerComponent,
    DurationPipe,
    ArtistAddSuggestionComponent,
    SongEditCardComponent,
    AlbumEditCardComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    VgDirectivesModule,
    VgControlModule.forRoot({
      provide: VgErrorDictService,
      useFactory: (translateService: TranslateService) => {
        const vgErrorDictService: VgErrorDictService = new VgErrorDictService();
        vgErrorDictService.register('validation.message.', translateService, 'instant');
        return vgErrorDictService;
      },
      deps: [TranslateService]
    }),
    VgUtilModule
  ],
  providers: [],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    CardComponent,
    SpinnerComponent,
    EnvPipe,
    ModalWrapperComponent,
    VgControlModule,
    MusicPlayerComponent,
    NgbModule,
    DurationPipe,
    ArtistAddSuggestionComponent,
    SongEditCardComponent,
    AlbumEditCardComponent
  ]
})
export class SharedModule {}
