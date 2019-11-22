import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {Artist} from '../../models/artist';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ArtistService} from '../../services/artist.service';
import {SongService} from '../../services/song.service';
import {Subscription} from 'rxjs';
import {Song} from '../../models/song';
import {PlayingQueueService} from '../../services/playing-queue.service';
import {PlaylistService} from '../../services/playlist.service';
import {Playlist} from '../../models/playlist';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  currentUser: User;
  artist: Artist;
  artistId: number;
  message: string;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  loading1: boolean;
  loading2: boolean;
  loading3: boolean;
  totalPages: number;
  songList: Song[] = [];
  playlistList: Playlist[] = [];
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private artistService: ArtistService,
              private songService: SongService, private playlistService: PlaylistService,
              private playingQueueService: PlayingQueueService, private userService: UserService, public translate: TranslateService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.loading1 = true;
        this.artistId = params.id;
        this.getArtistDetail();
      }
    ));
  }

  getArtistDetail() {
    this.subscription.add(this.artistService.artistDetail(this.artistId)
      .pipe(finalize(() => {
        this.loading1 = false;
      }))
      .subscribe(
        result => {
          window.scroll(0, 0);
          this.artist = result;
          this.loading2 = true;
          this.getSongListOfArtist();
        }, error => {
          this.message = 'An error has occurred.';
          console.log(error.message);
        }
      ));
  }

  getSongListOfArtist() {
    this.subscription.add(this.artistService.getSongListOfArtist(this.artistId, this.pageNumber).subscribe(
      result1 => {
        if (result1 != null) {
          this.totalPages = result1.totalPages;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < result1.content.length; i++) {
            this.songList.push(result1.content[i]);
          }
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        }
      }, error => {
        this.message = 'An error has occurred.';
        console.log(error.message);
      }, () => {
        this.loading2 = false;
      }
    ));
  }

  onScroll() {
    this.pageNumber = ++this.pageNumber;
    if (this.pageNumber < this.totalPages) {
      this.loading3 = true;
      this.subscription.add(this.artistService.getSongListOfArtist(this.artistId, this.pageNumber).subscribe(
        result => {
          if (result != null) {
            this.totalPages = result.totalPages;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < result.content.length; i++) {
              this.songList.push(result.content[i]);
            }
            this.songList.forEach((value, index) => {
              this.songList[index].isDisabled = false;
            });
            for (const song of this.songList) {
              this.checkDisabledSong(song);
            }
            this.first = result.first;
            this.last = result.last;
            this.pageNumber = result.pageable.pageNumber;
            this.pageSize = result.pageable.pageSize;
          }
        }, error => {
          this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
        }, () => {
          this.loading3 = false;
        }
      ));
    } else {
      this.pageNumber = --this.pageNumber;
    }
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
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

  refreshSong(song: Song, index: number) {
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.songDetail(song.id).subscribe(
      result => {
        this.songList[index] = result;
      }, error => {
        console.log(error);
      }, () => {
        song.loadingLikeButton = false;
      }
    ));
  }

  likeSong(song: Song, index: number, event) {
    event.stopPropagation();
    this.subscription.add(this.songService.likeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.refreshSong(song, index));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(song: Song, index: number, event) {
    event.stopPropagation();
    this.songService.unlikeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.refreshSong(song, index));
      }, error => {
        console.log(error);
      }
    );
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
