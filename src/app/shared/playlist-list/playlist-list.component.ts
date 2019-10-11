import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {PlaylistService} from '../../service/playlist.service';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit, OnChanges {

  title: string;
  @Input() songId: number;
  @Input() playlistList: Playlist[] = [];
  @Output() addSongToPlaylistEvent = new EventEmitter();
  closeResult: string;
  message: string;
  subscription: Subscription = new Subscription();

  constructor(private playlistService: PlaylistService) {
  }

  ngOnInit() {
    // this.subscription.unsubscribe();
    // this.playlistService.getPlaylistListToAdd(this.songId).subscribe(
    //   result => {
    //     this.playlistList = result.content;
    //     if (this.songId === 9) {
    //       console.log(result);
    //     }
    //   }, error => {
    //     this.message = 'Cannot retrieve playlist list. Cause: ' + error.message;
    //   }
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.subscription.unsubscribe();
    // this.playlistService.getPlaylistListToAdd(this.songId).subscribe(
    //   result => {
    //     this.playlistList = result.content;
    //     if (this.songId === 9) {
    //       console.log(result);
    //     }
    //   }, error => {
    //     this.message = 'Cannot retrieve playlist list. Cause: ' + error.message;
    //   }
    // );
  }

  addSongToPlaylist(songId: number, playlistId: number) {
    this.playlistService.addSongToPlaylist(songId, playlistId).subscribe(
      () => {
        this.message = 'Song added to playlist';
        this.playlistService.getPlaylistListToAdd(songId).subscribe(
          result => {
            this.playlistList = result;
          },
          error1 => {
            this.message = 'Cannot retrieve playlist. Cause ' + error1.message;
          }
        );
      }, error => {
        this.message = 'Cannot add song to playlist. Cause: ' + error.message;
      }
    );
  }

}
