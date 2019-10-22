import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../model/page';
import {Song} from '../../model/song';
import {Subscription} from 'rxjs';
import {Playlist} from '../../model/playlist';
import {AddSongToPlaylistComponent} from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';

@Component({
  selector: 'app-uploaded-song-list',
  templateUrl: './uploaded-song-list.component.html',
  styleUrls: ['./uploaded-song-list.component.scss']
})
export class UploadedSongListComponent implements OnInit, OnDestroy {

  pageNumber: number;
  pageSize: number;
  pages: Page[] = [];
  message: string;
  songList: Song[];
  loading: boolean;
  subscription: Subscription = new Subscription();
  @ViewChild(AddSongToPlaylistComponent, {static: false}) child: AddSongToPlaylistComponent;

  constructor(private songService: SongService, private playingQueueService: PlayingQueueService) { }

  ngOnInit() {
    this.loading = true;
    this.subscription.add(this.songService.getUserSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }, () => {
        this.loading = false;
      }
    ));
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    song.isDisabled = true;
    this.playingQueueService.addToQueue(song);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
