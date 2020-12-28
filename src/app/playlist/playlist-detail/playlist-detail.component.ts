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
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';

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
  loading: boolean;

  constructor(private playlistService: PlaylistService, private songService: SongService,
              private route: ActivatedRoute, private playingQueueService: PlayingQueueService, public translate: TranslateService) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe(
      params => {
        this.playlistId = params.id;
        this.refreshPlaylistDetail();
      }
    );
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  refreshPlaylistDetail() {
    this.subscription.add(this.playlistService.getPlayListDetail(this.playlistId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
      result => {
        if (result != null) {
          this.playList = result;
          this.playList.isDisabled = false;
          this.songList = this.playList.songs;
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        } else {
          this.playList = null;
        }
      }, error => {
        this.message = 'An error has occurred.';
        console.log(error.message);
      }
    ));
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








