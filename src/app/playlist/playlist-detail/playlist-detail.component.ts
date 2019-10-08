import {Component, OnInit} from '@angular/core';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';
import {Song} from '../../model/song';
import {Playlist} from '../../model/playlist';
import {Observable, of, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent {
  private message;
  private songList: any[];
  private playList: Playlist;
  private subscription: Subscription;
  private playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private addSongToPlaylistService: AddSongToPlaying
  ) {
  }

  ngOnInit() {
    this.playlistId = +this.route.snapshot.paramMap.get('id');
    this.subscription = this.playlistService.getPlayListDetail(this.playlistId).subscribe(
      result => {
        if (result != null) {
          this.playList = result;

          this.playList.isDisabled = false;
          this.songList = this.playList.songs;

        }
        console.log(this.playList);
      }, error => {
        this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
      }
    );

  }

  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaylistService.emitChange(song);
  }

  deletePlaylistSong() {
    this.subscription = this.playlistService.getPlayListDetail(this.playlistId).subscribe(
      result => {
        if (result != null) {
          this.playList = result;
        } else {
          this.playList = null;
        }
      }, error => {
        this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
      }
    );
  }

}








