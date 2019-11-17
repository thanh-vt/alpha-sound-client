import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {Album} from '../../model/album';
import {AlbumService} from '../../service/album.service';
import {Song} from '../../model/song';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {Playlist} from '../../model/playlist';
import {PlaylistService} from '../../service/playlist.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  currentUser: User;
  album: Album;
  albumId: number;
  songList: Song[] = [];
  playlistList: Playlist[];
  loading: boolean;
  message: string;
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private albumService: AlbumService,
              private songService: SongService, private playingQueueService: PlayingQueueService,
              private userService: UserService, private playlistService: PlaylistService, private translate: TranslateService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.loading = true;
        this.albumId = params.id;
        this.subscription.add(this.albumService.albumDetail(this.albumId).subscribe(
          result => {
            this.album = result;
            this.songList = result.songs;
            for (const song of this.songList) {
              this.checkDisabledSong(song);
            }
          }, error => {
            this.message = 'Cannot retrieve album detail. Cause: ' + error.message;
          }, () => {
            for (const song of this.songList) {
              if (song.loadingLikeButton) {
                song.loadingLikeButton = false;
              }
            }
            this.loading = false;
          }
        ));
      }
    ));
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  addAllToPlaying(event) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.album.songs.length; i++) {
      this.addToPlaying(this.album.songs[i], event);
    }
    this.album.isDisabled = true;
  }

  refreshPlaylistList(songId: number) {
    this.subscription.add(this.playlistService.getPlaylistListToAdd(songId).subscribe(
      result => {
        this.playlistList = result;
      }, error => {
        console.log(error);
      }
    ));
  }

  likeSong(song: Song, event) {
    event.stopPropagation();
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.likeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.albumService.albumDetail(this.albumId).subscribe(
          result => {
            this.album = result;
            this.songList = result.songs;
          }, error => {
            console.log(error);
          }, () => {
            song.loadingLikeButton = false;
      }
        ));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(song: Song, event) {
    event.stopPropagation();
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.unlikeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.albumService.albumDetail(this.albumId).subscribe(
          result => {
            this.album = result;
            this.songList = result.songs;
          }, error => {
            console.log(error);
          }, () => {
            song.loadingLikeButton = false;
          }
        ));
      }, error => {
        console.log(error);
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
