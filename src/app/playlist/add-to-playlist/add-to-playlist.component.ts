import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Playlist} from '../../model/playlist';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-to-playlist',
  templateUrl: './add-to-playlist.component.html',
  styleUrls: ['./add-to-playlist.component.scss']
})
export class AddToPlaylistComponent implements OnInit {
  message: string;
  private subscription: Subscription;
  private playlistList: Playlist[];
  private songId: number;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private songService: SongService) {
  }

  ngOnInit() {
    const songId = this.route.snapshot.paramMap.get('songId');
    this.songId = Number.parseInt(songId, 10);
    this.subscription = this.playlistService.getPlaylistList().subscribe(
      result => {
        if (result != null) {
          this.playlistList = result.content;
          this.playlistList.forEach((value, index) => {
            this.playlistList[index].isDisabled = false;
          });
        }
      }, error => {
        this.message = 'Cannot retrieve Playlist list. Cause: ' + error.message;
      }
    );
  }

  addPlaylist() {
    this.subscription = this.playlistService.getPlaylistList().subscribe(
      result => {
        if (result != null) {
          this.playlistList = result.content;
          this.playlistList.forEach((value, index) => {
            this.playlistList[index].isDisabled = false;
          });
        }
      }, error => {
        this.message = 'Cannot retrieve Playlist list. Cause: ' + error.message;
      }
    );
  }

  addSongToPlayList(songId: number, playlistId: number) {
    this.songService.addSongToPlaylist(songId, playlistId).subscribe(
      next => {
        this.message = 'Add song to playlist successfully!';
      }, error => {
        this.message = 'Failed add song to playlist!';
      }
    );
  }

}
