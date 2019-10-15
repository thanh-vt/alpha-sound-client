import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  private message;
  private songList: Song[];
  private playList: Playlist;
  private subscription: Subscription = new Subscription();
  private playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private addSongToPlaying: AddSongToPlaying
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.playlistId = params.id;
        console.log(this.playlistId);
      }
    );
    this.subscription.add(this.playlistService.getPlayListDetail(this.playlistId).subscribe(
      result => {
        if (result != null) {
          this.playList = result;
          this.playList.isDisabled = false;
          this.songList = this.playList.songs;

        }
      }, error => {
        this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
      }
    ));

  }

  addToPlayling(song) {
    song.isDisabled = true;
    this.addSongToPlaying.emitChange(song);
  }

  deletePlaylistSong() {
    this.subscription.add(this.playlistService.getPlayListDetail(this.playlistId).subscribe(
      result => {
        if (result != null) {
          this.playList = result;
          this.playList.isDisabled = false;
          this.songList = this.playList.songs;
        } else {
          this.playList = null;
        }
      }, error => {
        this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}








