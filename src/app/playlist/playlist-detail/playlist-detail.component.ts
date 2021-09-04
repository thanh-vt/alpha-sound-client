import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaylistService } from '../../service/playlist.service';
import { SongService } from '../../service/song.service';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../../model/song';
import { Playlist } from '../../model/playlist';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TOAST_TYPE, VgLoaderService, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  songList: Song[];
  playList: Playlist;
  subscription: Subscription = new Subscription();
  playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastService: VgToastService,
    public translate: TranslateService,
    private loaderService: VgLoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.playlistId = params.id;
      await this.refreshPlaylistDetail();
    });
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  async refreshPlaylistDetail(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.playList = await this.playlistService.getPlayListDetail(this.playlistId).toPromise();
      this.playList.isDisabled = false;
      this.songList = this.playList.songs;
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  openDeleteDialog(playlist: Playlist, song: Song): void {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
