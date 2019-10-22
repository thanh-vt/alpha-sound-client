import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SongService} from '../../service/song.service';
import {Song} from '../../model/song';
import { PlayingQueueService} from '../../service/playing-queue.service';
import {Page} from '../../model/page';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {UserComponent} from '../../user/user/user.component';
import {AuthService} from '../../service/auth.service';
import {UserToken} from '../../model/userToken';
import {User} from '../../model/user';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  currentUser: User;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  message: string;
  songList: Song[] = [];
  playlistList: Playlist[] = [];
  loading: boolean;
  subscription: Subscription = new Subscription();

  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;

  constructor(private songService: SongService, private playingQueueService: PlayingQueueService,
              private playlistService: PlaylistService, private userService: UserService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber, true);
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(this.songService.getSongList(i, undefined).subscribe(
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
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
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
