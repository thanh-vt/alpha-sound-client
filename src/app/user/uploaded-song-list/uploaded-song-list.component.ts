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

  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  private isDisable: boolean;
  private subscription: Subscription = new Subscription();
  @ViewChild(AddSongToPlaylistComponent, {static: false}) child: AddSongToPlaylistComponent;

  constructor(private songService: SongService, private playingQueueService: PlayingQueueService) { }

  ngOnInit() {
    this.subscription.add(this.songService.getUserSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
        }
      }, error => {
        this.isDisable = true;
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    ));
  }

  addToPlaying(song) {
    song.isDisabled = true;
    this.playingQueueService.emitChange(song);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
