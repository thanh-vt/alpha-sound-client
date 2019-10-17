import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlbumService} from '../../service/album.service';
import {Album} from '../../model/album';
import {UserToken} from '../../model/userToken';
import {Page} from '../../model/page';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {UserService} from '../../service/user.service';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit, OnDestroy {
  currentUser: User;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private albumList: Album[];
  subscription: Subscription = new Subscription();

  constructor(private albumService: AlbumService, private userService: UserService, private songService: SongService, private playingQueueService: PlayingQueueService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.goToPage(this.pageNumber);
  }

  goToPage(i) {
    this.subscription.add(this.albumService.albumList(i, undefined).subscribe(
      result => {
        if (result != null) {
          window.scroll(0, 0);
          this.albumList = result.content;
          this.albumList.forEach((value, index) => {
            this.albumList[index].isDisabled = false;
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
      }
    ));
  }

  addToPlaying(song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.playingQueueService.addToQueue({
          title: song.title,
          link: song.url
        });
      }
    ));
  }

  addAllToPlaying(albumId: number) {
    // tslint:disable-next-line:prefer-for-of
    this.albumService.albumDetail(albumId).subscribe(
      result => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < result.songs.length; i++) {
          this.addToPlaying(result.songs[i]);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
