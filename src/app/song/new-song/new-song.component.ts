import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Song } from '../../model/song';
import { SongService } from '../../service/song.service';
import { Page } from '../../model/page';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { PlaylistService } from '../../service/playlist.service';
import { Subscription } from 'rxjs';
import { UserComponent } from '../../user/user/user.component';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';
import { NgbCarousel, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSongComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  first: boolean;
  last: boolean;
  loading: boolean;
  songList: Song[] = [];
  imageOrder = 0;
  Math: Math = Math;
  subscription: Subscription = new Subscription();

  images = [1, 2, 3].map(() => `${environment.baseHref}/assets/slides/slide_number_${this.roll()}.jpg`);
  description: string[] = ['Bring you the greatest music', 'Hundreds of songs and albums', 'Customize your own playlist'];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  @ViewChild(UserComponent) userComponent: UserComponent;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor(
    private songService: SongService,
    private playingQueueService: PlayingQueueService,
    private playlistService: PlaylistService,
    private authService: AuthService,
    public translate: TranslateService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {
    this.authService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
      if (this.currentUser) {
        this.songService.patchLikes(this.songList);
      }
    });
  }

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber, true);
  }

  roll() {
    if (this.imageOrder === 3) {
      this.imageOrder = 0;
    }
    return ++this.imageOrder;
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(
      this.songService
        .getSongList({ page: i, sort: ['release_date,desc'] })
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          result => {
            if (result != null) {
              if (scrollUp) {
                window.scroll(0, 0);
              }
              this.songList = result.content;
              this.songList.forEach((value, index) => {
                this.songList[index].isDisabled = false;
              });
              this.first = result.first;
              this.last = result.last;
              this.pageNumber = result.pageable.pageNumber;
              this.pageSize = result.pageable.pageSize;
              this.pages = new Array(result.totalPages);
              for (let j = 0; j < this.pages.length; j++) {
                this.pages[j] = { pageNumber: j };
              }
              for (const song of this.songList) {
                this.checkDisabledSong(song);
              }
            }
          },
          error => {
            console.log(error.message);
            this.toastService.error('Error', 'An error has occurred');
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

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
