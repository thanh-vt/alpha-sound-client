import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Song} from '../../models/song';
import {SongService} from '../../services/song.service';
import {Page} from '../../models/page';
import {PlayingQueueService} from '../../services/playing-queue.service';
import {PlaylistService} from '../../services/playlist.service';
import {Playlist} from '../../models/playlist';
import {Subscription} from 'rxjs';
import {UserComponent} from '../../user/user/user.component';
import {UserToken} from '../../models/userToken';
import {AuthService} from '../../services/auth.service';
import {NgbCarousel, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSongComponent implements OnInit, OnDestroy {
  currentUser: UserToken;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  first: boolean;
  last: boolean;
  message: string;
  loading: boolean;
  songList: Song[] = [];
  imageOrder = 0;
  Math: Math = Math;
  subscription: Subscription = new Subscription();
  playlistList: Playlist[];

  images = [1, 2, 3].map(() => `../../../assets/slides/slide_number_${this.roll()}.jpg`);
  description: string[] = ['Bring you the climax music', 'Hundreds of songs and albums', 'Customize your own playlist'];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  // tslint:disable-next-line:max-line-length
  constructor(private songService: SongService, private playingQueueService: PlayingQueueService,
              private playlistService: PlaylistService, private authService: AuthService, public translate: TranslateService) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
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
    this.subscription.add(this.songService.getSongList(i, 'releaseDate')
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
      result => {
        if (result != null) {
          if (scrollUp) {window.scroll(0, 0); }
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
            this.pages[j] = {pageNumber: j};
          }
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        }
      }, error => {
        this.message = 'An error has occurred.';
        console.log(error.message);
      }, () => {
        for (const song of this.songList) {
          if (song.loadingLikeButton) {
            song.loadingLikeButton = false;
          }
        }
      }
    ));
  }

  refreshPlaylistList(songId) {
    this.subscription.add(this.playlistService.getPlaylistListToAdd(songId).subscribe(
      result => {
        this.playlistList = result;
      }, error => {
        console.log(error);
      }
    ));
  }

  likeSong(song: Song, event) {
    event.stopPropagation();
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.likeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(song: Song, event) {
    event.stopPropagation();
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.unlikeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
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
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
