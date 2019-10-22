import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {Song} from '../../model/song';
import {Playlist} from '../../model/playlist';
import {Observable, of, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';
import {Track} from 'ngx-audio-player';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  message: string;
  songList: Song[];
  playList: Playlist;
  subscription: Subscription = new Subscription();
  playlistId: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private playingQueueService: PlayingQueueService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.playlistId = params.id;
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

  addToPlaying(song: Song) {
    this.playingQueueService.addToQueue(song);
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








