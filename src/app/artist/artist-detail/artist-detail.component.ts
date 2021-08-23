import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artist } from '../../model/artist';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ArtistService } from '../../service/artist.service';
import { SongService } from '../../service/song.service';
import { Subscription } from 'rxjs';
import { Song } from '../../model/song';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { PlaylistService } from '../../service/playlist.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  artist: Artist;
  artistId: number;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  loading1: boolean;
  loading2: boolean;
  loading3: boolean;
  totalPages: number;
  songList: Song[] = [];
  subscription: Subscription = new Subscription();
  Math: Math = Math;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private artistService: ArtistService,
    private songService: SongService,
    private playlistService: PlaylistService,
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
        this.loading1 = true;
        this.artistId = params.id;
        this.getArtistDetail();
      })
    );
  }

  getArtistDetail() {
    this.subscription.add(
      this.artistService
        .artistDetail(this.artistId)
        .pipe(
          finalize(() => {
            this.loading1 = false;
          })
        )
        .subscribe(result => {
          window.scroll(0, 0);
          this.artist = result;
          this.loading2 = true;
          this.getSongListOfArtist();
        })
    );
  }

  getSongListOfArtist() {
    this.artistService
      .getSongListOfArtist(this.artistId, this.pageNumber)
      .pipe(
        finalize(() => {
          this.loading2 = false;
        })
      )
      .subscribe(result1 => {
        if (result1 != null) {
          this.totalPages = result1.totalPages;
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < result1.content.length; i++) {
            this.songList.push(result1.content[i]);
          }
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        }
      });
  }

  onScroll() {
    this.pageNumber = ++this.pageNumber;
    if (this.pageNumber < this.totalPages) {
      this.loading3 = true;
      this.subscription.add(
        this.artistService.getSongListOfArtist(this.artistId, this.pageNumber).subscribe(
          result => {
            if (result != null) {
              this.totalPages = result.totalPages;
              // eslint-disable-next-line @typescript-eslint/prefer-for-of
              for (let i = 0; i < result.content.length; i++) {
                this.songList.push(result.content[i]);
              }
              this.songList.forEach((value, index) => {
                this.songList[index].isDisabled = false;
              });
              for (const song of this.songList) {
                this.checkDisabledSong(song);
              }
              this.first = result.first;
              this.last = result.last;
              this.pageNumber = result.pageable.pageNumber;
              this.pageSize = result.pageable.pageSize;
            }
          },
          () => {
            this.loading3 = false;
          }
        )
      );
    } else {
      this.pageNumber = --this.pageNumber;
    }
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  refreshSong(song: Song, index: number) {
    song.loadingLikeButton = true;
    this.subscription.add(
      this.songService.songDetail(song.id).subscribe(
        result => {
          this.songList[index] = result;
        },
        () => {
          song.loadingLikeButton = false;
        }
      )
    );
  }

  likeSong(song: Song, index: number, event, isLiked: boolean) {
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
