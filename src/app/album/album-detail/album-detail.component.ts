import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { Album } from '../../model/album';
import { AlbumService } from '../../service/album.service';
import { Song } from '../../model/song';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  album: Album;
  albumId: number;
  songList: Song[] = [];
  loading: boolean;
  message: string;
  subscription: Subscription = new Subscription();
  Math: Math = Math;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private albumService: AlbumService,
    private songService: SongService,
    private playingQueueService: PlayingQueueService,
    public translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.loading = true;
        this.albumId = params.id;
        this.subscription.add(
          this.albumService
            .albumDetail(this.albumId)
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(
              result => {
                this.album = result;
                this.songList = result.songs;
                for (const song of this.songList) {
                  this.checkDisabledSong(song);
                }
              },
              () => {
                for (const song of this.songList) {
                  if (song.loadingLikeButton) {
                    song.loadingLikeButton = false;
                  }
                }
              }
            )
        );
      })
    );
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  addAllToPlaying(event) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.album.songs.length; i++) {
      this.addToPlaying(this.album.songs[i], event);
    }
    this.album.isDisabled = true;
  }

  likeSong(song: Song, event, isLiked: boolean) {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
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

  openPlaylistDialog(songId: number, event: Event) {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
