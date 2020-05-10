import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SongService} from '../../services/song.service';
import {Song} from '../../models/song';
import { PlayingQueueService} from '../../services/playing-queue.service';
import {Page} from '../../models/page';
import {PlaylistService} from '../../services/playlist.service';
import {Playlist} from '../../models/playlist';
import {Subscription} from 'rxjs';
import {UserComponent} from '../../user/user/user.component';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';
import {UserToken} from '../../models/userToken';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  currentUser: UserToken;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  message: string;
  songList: Song[] = [];
  playlistList: Playlist[] = [];
  loading: boolean;
  Math: Math = Math;
  subscription: Subscription = new Subscription();

  @ViewChild(UserComponent) userComponent: UserComponent;

  constructor(private songService: SongService, private playingQueueService: PlayingQueueService,
              private playlistService: PlaylistService, public translate: TranslateService,
              private authService: AuthService) {
    this.authService.currentUserToken.subscribe(
      next => {
        this.currentUser = next;
      }
    );
  }

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber, true);
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(this.songService.getSongList(i, undefined)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        result => {
          if (result != null) {
            if (scrollUp) {window.scroll(0, 0); }
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
          }
        }, error => {
          this.message = 'An error has occurred.';
          console.log(error.message);
        }, () => {
          for (const song of this.songList) {
            if (song.loadingLikeButton) {
              song.loadingLikeButton = false;
            }
          }
        }
      ));
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  refreshPlaylistList(songId) {
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
        this.subscription.add(this.goToPage(this.pageNumber));
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
        this.subscription.add(this.goToPage(this.pageNumber));
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
