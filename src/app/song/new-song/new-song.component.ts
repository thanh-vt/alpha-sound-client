import { Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../model/song';
import { SongService } from '../../service/song.service';
import { UserComponent } from '../../user/user/user.component';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss']
})
export class NewSongComponent implements OnInit {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  imageOrder = 0;
  images = [1, 2, 3].map(() => `${environment.baseHref}/assets/slides/slide_number_${this.roll()}.jpg`);
  description: string[] = ['Bring you the greatest music', 'Hundreds of songs and albums', 'Customize your own playlist'];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  @ViewChild(UserComponent) userComponent: UserComponent;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor(private songService: SongService, private loaderService: VgLoaderService) {}

  ngOnInit(): void {
    this.goToPage(this.songPage.pageable?.pageNumber, true);
  }

  roll(): number {
    if (this.imageOrder === 3) {
      this.imageOrder = 0;
    }
    return ++this.imageOrder;
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
}
