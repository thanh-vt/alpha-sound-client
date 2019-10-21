import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Song} from '../../model/song';
import {User} from '../../model/user';
import {Page} from '../../model/page';
import {Subscription} from 'rxjs';
import {Playlist} from '../../model/playlist';
import {UserComponent} from '../user/user.component';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  currentUser: User;
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

  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;

  // tslint:disable-next-line:max-line-length
  constructor(private songService: SongService, private playingQueueService: PlayingQueueService,
              private playlistService: PlaylistService, private userService: UserService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
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

  addToPlaying(song) {
    this.playingQueueService.addToQueue({
      title: song.title,
      link: song.url
    }, song.id);
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

  likeSong(song: Song) {
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

  unlikeSong(song: Song) {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
