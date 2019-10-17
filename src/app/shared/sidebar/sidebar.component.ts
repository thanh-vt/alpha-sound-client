import { Component, OnInit } from '@angular/core';
import {Page} from '../../model/page';
import {Song} from '../../model/song';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private pageNumber: number;
  private pageSize: number;
  private first: boolean;
  private last: boolean;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  constructor(private route: ActivatedRoute, private songService: SongService, private playingQueueService: PlayingQueueService) {
  }

  ngOnInit() {
    this.goToPage(undefined);
  }
  addToPlaylist(song) {
    song.isDisabled = true;
    this.playingQueueService.emitChange(song);
  }

  goToPage(i) {
    this.songService.getSongList(i, 'listeningFrequency').subscribe(
      result => {
        if (result != null) {
          window.scroll(0, 0);
          this.songList = result.content;
          this.first = result.first;
          this.last = result.last;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let j = 0; j < this.pages.length; j++) {
            this.pages[j] = {pageNumber: j};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }
}
