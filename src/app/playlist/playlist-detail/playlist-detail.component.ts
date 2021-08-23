import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaylistService } from '../../service/playlist.service';
import { SongService } from '../../service/song.service';
import { ActivatedRoute } from '@angular/router';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { Song } from '../../model/song';
import { Playlist } from '../../model/playlist';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';

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
  loading: boolean;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private playingQueueService: PlayingQueueService,
    private modalService: NgbModal,
    private toastService: VgToastService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      this.playlistId = params.id;
      this.refreshPlaylistDetail();
    });
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  refreshPlaylistDetail() {
    this.subscription.add(
      this.playlistService
        .getPlayListDetail(this.playlistId)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(result => {
          if (result != null) {
            this.playList = result;
            this.playList.isDisabled = false;
            this.songList = this.playList.songs;
            for (const song of this.songList) {
              this.checkDisabledSong(song);
            }
          } else {
            this.playList = null;
          }
        })
    );
  }

  checkDisabledSong(song: Song) {
    let isDisabled = false;
    for (const track of this.playingQueueService.currentQueueSubject.value) {
      if (song.url === track.link) {
        isDisabled = true;
        break;
      }
    }
    song.isDisabled = isDisabled;
  }

  openDeleteDialog(playlist: Playlist, song: Song) {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = modalRef.componentInstance;
    comp.subject = this.translate.instant('Do you want to delete playlist');
    comp.name = playlist?.title;
    comp.data = { playlist, song };
    const sub: Subscription = modalRef.closed.subscribe((result: { song: Song; playlist: Playlist }) => {
      if (result) {
        this.loading = true;
        this.songService
          .deleteSongFromPlaylist(result.song?.id, result.playlist?.id)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe(() => {
            this.toastService.show({ text: 'Song from playlist removed successfully' }, { type: TOAST_TYPE.SUCCESS });
          });
      }
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
