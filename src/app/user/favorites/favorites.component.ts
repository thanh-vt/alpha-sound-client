import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Song} from '../../model/song';
import {Page} from '../../model/page';
import {Subscription} from 'rxjs';
import {Playlist} from '../../model/playlist';
import {UserComponent} from '../user/user.component';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../service/auth.service';
import {TokenResponse, UserProfile} from '../../model/token-response';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  songList: Song[] = [];
  playlistList: Playlist[];
  message: string;
  loading: boolean;
  subscription: Subscription = new Subscription();

  @ViewChild(UserComponent) userComponent: UserComponent;
  Math: Math = Math;

  // tslint:disable-next-line:max-line-length
  constructor(private songService: SongService, private playingQueueService: PlayingQueueService,
              private playlistService: PlaylistService, public translate: TranslateService,
              private authService: AuthService) {
    this.authService.currentUser$.subscribe(
      next => {
        this.currentUser = next;
      }
    );
    this.playingQueueService.update.subscribe(
      () => {
        this.goToPage(this.pageNumber);
      }
    );
  }

  ngOnInit() {
    this.goToPage(this.pageNumber, true);
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  goToPage(i: number, scroll?: boolean) {
    this.loading = true;
    this.subscription.add(this.songService.getUserFavoriteSongList(i, undefined).subscribe(
      result => {
        if (result != null) {
          if (scroll) { window.scroll(0, 0); }
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.first = result.first;
          this.last = result.last;
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let j = 0; j < this.pages.length; j++) {
            this.pages[j] = {pageNumber: j};
          }
          for (const song of this.songList) {
            this.checkDisabledSong(song);
          }
        } else {
          this.songList = [];
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }, () => {
        this.loading = false;
      }
    ));
  }

  refreshPlaylistList(song: Song) {
    this.subscription.add(this.playlistService.getPlaylistListToAdd(song.id).subscribe(
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
        this.subscription.add(this.goToPage(this.pageNumber, false));
      }, error => {
        console.log(error);
      }, () => {
        song.loadingLikeButton = false;
      }
    ));
  }

  unlikeSong(song: Song, event) {
    event.stopPropagation();
    song.loadingLikeButton = true;
    this.songService.unlikeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber, false));
      }, error => {
        console.log(error);
      }, () => {
        song.loadingLikeButton = false;
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
