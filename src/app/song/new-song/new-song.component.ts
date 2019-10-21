import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Song} from '../../model/song';
import {SongService} from '../../service/song.service';
import {Page} from '../../model/page';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {UserComponent} from '../../user/user/user.component';
import {UserToken} from '../../model/userToken';
import {AuthService} from '../../service/auth.service';
@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss']
})
export class NewSongComponent implements OnInit, OnDestroy {
  currentUser: UserToken;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  first: boolean;
  last: boolean;
  message: string;
  songList: Song[];
  loading: boolean;
  subscription: Subscription = new Subscription();
  playlistList: Playlist[];
  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;

  // tslint:disable-next-line:max-line-length
  constructor(private songService: SongService, private playingQueueService: PlayingQueueService, private playlistService: PlaylistService, private authService: AuthService) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber, true);
  }

  addToPlaying(song: Song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.playingQueueService.addToQueue({
          title: song.title,
          link: song.url
        });
        song.isDisabled = true;
      }
    ));
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(this.songService.getSongList(i, 'releaseDate').subscribe(
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

  refreshPlaylistList(songId) {
    this.subscription.add(this.playlistService.getPlaylistListToAdd(songId).subscribe(
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
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(song: Song) {
    song.loadingLikeButton = true;
    this.subscription.add(this.songService.unlikeSong(song.id).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
