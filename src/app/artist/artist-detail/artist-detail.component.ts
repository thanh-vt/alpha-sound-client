import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {Artist} from '../../model/artist';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ArtistService} from '../../service/artist.service';
import {SongService} from '../../service/song.service';
import {Subscription} from 'rxjs';
import {Song} from '../../model/song';
import {Page} from '../../model/page';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';
import {UserService} from '../../service/user.service';
import {TranslateService} from '@ngx-translate/core';

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
        this.subscription.add(this.artistService.artistDetail(this.artistId).subscribe(
          result => {
            window.scroll(0, 0);
            this.artist = result;
            this.loading2 = true;
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
                this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
              }, () => {
                this.loading2 = false;
              }
            ));
          }, (error) => {
            console.log(error);
          }, () => {
            this.loading1 = false;
          }
        ));
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
