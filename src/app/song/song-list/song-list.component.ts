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

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  currentUser: UserToken;
  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  private isDisable: boolean;
  private subscription: Subscription = new Subscription();
  playlistList: Playlist[];
  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;

  // tslint:disable-next-line:max-line-length
  constructor(private songService: SongService, private playingQueueService: PlayingQueueService, private playlistService: PlaylistService, private authService: AuthService) {
    this.authService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.goToPage(undefined);
  }

  addToPlaying(song) {
    this.playingQueueService.addToQueue({
      title: song.title,
      link: song.url
    });
    console.log(this.playingQueueService.currentQueueValue);
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.goToPage(this.pageNumber);
      }
    ));
    console.log(this.playingQueueService.currentQueueValue);
  }

  goToPage(i) {
    this.subscription.add(this.songService.getSongList(i, undefined).subscribe(
      result => {
        if (result != null) {
          window.scroll(0, 0);
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let j = 0; j < this.pages.length; j++) {
            this.pages[j] = {pageNumber: j};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
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

  likeSong(songId: number) {
    this.subscription.add(this.songService.likeSong(songId).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(songId: number) {
    this.songService.unlikeSong(songId).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
