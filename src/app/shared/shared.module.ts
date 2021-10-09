import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './component/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSongToPlaylistComponent } from '../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { CardComponent } from './component/card/card.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationModalComponent } from './component/modal/confirmation-modal/confirmation-modal.component';
import { ModalWrapperComponent } from './component/modal/modal-wrapper/modal-wrapper.component';
import { VgControlModule, VgDialogModule, VgDirectivesModule, VgErrorDictService, VgUtilModule } from 'ngx-vengeance-lib';
import { MusicPlayerComponent } from './layout/music-player/music-player.component';
import { DurationPipe } from './layout/music-player/duration.pipe';
import { SongEditCardComponent } from './component/song-edit-card/song-edit-card.component';
import { ArtistSuggestionComponent } from './component/artist-suggestion/artist-suggestion.component';
import { AlbumEditCardComponent } from './component/album-edit-card/album-edit-card.component';
import { SongLikeBtnComponent } from './component/song-like-btn/song-like-btn.component';
import { SongMenuBtnComponent } from './component/song-menu-btn/song-menu-btn.component';
import { SongPlayBtnComponent } from './component/song-play-btn/song-play-btn.component';
import { AlbumPlayBtnComponent } from './component/album-play-btn/album-play-btn.component';
import { SongSuggestionComponent } from './component/song-suggestion/song-suggestion.component';
import { SongAddCardComponent } from './component/song-add-suggestion/song-add-card.component';
import { SongEditAdditionalInfoComponent } from './component/song-edit-additional-info/song-edit-additional-info.component';
import { StringArrayPipe } from './pipe/string-array.pipe';
import { LikesPipe } from './pipe/likes.pipe';
import { SongTableComponent } from './component/song-table/song-table.component';
import { AlbumEditAdditionalInfoComponent } from './component/album-edit-additional-info/album-edit-additional-info.component';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { CommentBoxComponent } from './component/comment-box/comment-box.component';
import { AlbumLikeBtnComponent } from './component/album-like-btn/album-like-btn.component';
import { ArtistLikeBtnComponent } from './component/artist-like-btn/artist-like-btn.component';
import { SongEditModalComponent } from './component/song-edit-modal/song-edit-modal.component';
import { SongScrollingTitlePipe } from './pipe/song-scrolling-title.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    CardComponent,
    SpinnerComponent,
    ConfirmationModalComponent,
    ModalWrapperComponent,
    MusicPlayerComponent,
    DurationPipe,
    ArtistSuggestionComponent,
    SongEditCardComponent,
    AlbumEditCardComponent,
    SongLikeBtnComponent,
    SongMenuBtnComponent,
    SongPlayBtnComponent,
    AlbumPlayBtnComponent,
    SongSuggestionComponent,
    SongAddCardComponent,
    SongEditAdditionalInfoComponent,
    StringArrayPipe,
    LikesPipe,
    SongTableComponent,
    AlbumEditAdditionalInfoComponent,
    CommentBoxComponent,
    AlbumLikeBtnComponent,
    ArtistLikeBtnComponent,
    SongEditModalComponent,
    SongScrollingTitlePipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    VgDialogModule,
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
    VgUtilModule,
    FormsModule
  ],
  providers: [],
  exports: [
    TranslateModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AddSongToPlaylistComponent,
    CardComponent,
    SpinnerComponent,
    ModalWrapperComponent,
    VgControlModule,
    MusicPlayerComponent,
    NgbModule,
    DurationPipe,
    ArtistSuggestionComponent,
    SongEditCardComponent,
    AlbumEditCardComponent,
    SongLikeBtnComponent,
    SongMenuBtnComponent,
    SongPlayBtnComponent,
    AlbumPlayBtnComponent,
    SongAddCardComponent,
    StringArrayPipe,
    SongTableComponent,
    CommentBoxComponent,
    ArtistLikeBtnComponent,
    AlbumLikeBtnComponent,
    LikesPipe
  ]
})
export class SharedModule {}
