import { Component, OnDestroy, OnInit } from '@angular/core';
import { Song } from '../../../model/song';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../../service/song.service';
import { PlayingQueueService } from '../../../service/playing-queue.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  message: string;
  loading: boolean;
  songList: Song[];
  subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private songService: SongService, private playingQueueService: PlayingQueueService) {}

  ngOnInit() {
    this.goToPage();
  }

  addToPlaying(song) {
    song.isDisabled = true;
    this.playingQueueService.addToQueue(song);
  }

  goToPage() {
    this.loading = true;
    this.songService
      .getSongList({ page: 0, size: 10, sort: ['listening_frequency'] })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result != null) {
          window.scroll(0, 0);
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
