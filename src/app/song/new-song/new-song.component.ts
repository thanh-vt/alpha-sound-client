import { Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss']
})
export class NewSongComponent {
  imageOrder = 0;
  images = [1, 2, 3].map(() => `assets/slides/slide_number_${this.roll()}.jpg`);
  description: string[] = ['Bring you the greatest music', 'Hundreds of songs and albums', 'Customize your own playlist'];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  paramsFetch = { sort: 'release_date,desc' };
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  roll(): number {
    if (this.imageOrder === 3) {
      this.imageOrder = 0;
    }
    return ++this.imageOrder;
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
