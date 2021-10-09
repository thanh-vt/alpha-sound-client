import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaylistService } from '../../service/playlist.service';
import { SongService } from '../../service/song.service';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../../model/song';
import { Playlist } from '../../model/playlist';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TOAST_TYPE, VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile>;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  playList: Playlist;
  subscription: Subscription = new Subscription();
  playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastService: VgToastService,
    public translate: TranslateService,
    private loaderService: VgLoaderService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.playlistId = params.id;
      await this.refreshPlaylistDetail();
    });
  }

  async refreshPlaylistDetail(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.playList = await this.playlistService.getPlayListDetail(this.playlistId).toPromise();
      await this.getSongPage();
      this.playList.isDisabled = false;
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  openDeleteDialog(playlist: Playlist, song: Song, event: MouseEvent): void {
    event.stopPropagation();
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = modalRef.componentInstance;
    comp.subject = this.translate.instant('Do you want to delete playlist');
    comp.name = playlist?.title;
    comp.data = { playlist, song };
    const sub: Subscription = modalRef.closed.subscribe(async (result: { song: Song; playlist: Playlist }) => {
      if (result) {
        try {
          this.loaderService.loading(true);
          await this.playlistService.deleteSongFromPlaylist(result.playlist?.id, [result.song?.id]).toPromise();
          this.toastService.show({ text: 'Song from playlist removed successfully' }, { type: TOAST_TYPE.SUCCESS });
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      }
      sub.unsubscribe();
    });
  }

  async getSongPage(page = 0): Promise<void> {
    this.songPage = await this.songService.getPlaylistSongList(this.playlistId, page).toPromise();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
