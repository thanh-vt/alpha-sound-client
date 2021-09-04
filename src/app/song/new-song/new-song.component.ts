import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Song } from '../../model/song';
import { SongService } from '../../service/song.service';
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
import { VgLoaderService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSongComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
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
    private playlistService: PlaylistService,
    private authService: AuthService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {
    this.authService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
      if (this.currentUser) {
        this.songService.patchLikes(this.songPage.content);
      }
    });
  }

  ngOnInit(): void {
    this.goToPage(this.songPage.pageable?.pageNumber, true);
  }

  roll(): number {
    if (this.imageOrder === 3) {
      this.imageOrder = 0;
    }
    return ++this.imageOrder;
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  goToPage(i: number, scrollUp?: boolean): void {
    this.loaderService.loading(true);
    this.songService
      .songList({ page: i, sort: ['release_date,desc'] })
      .pipe(
        finalize(() => {
          this.loaderService.loading(false);
        })
      )
      .subscribe(
        result => {
          if (result != null) {
            if (scrollUp) {
              window.scroll(0, 0);
            }
            this.songPage = result;
          }
        },
        () => {
          for (const song of this.songPage.content) {
            if (song.loadingLikeButton) {
              song.loadingLikeButton = false;
            }
          }
        }
      );
  }

  likeSong(song: Song, event: Event, isLiked: boolean): void {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
  }

  togglePaused(): void {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent): void {
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

  openPlaylistDialog(songId: number, event: Event): void {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }
}
