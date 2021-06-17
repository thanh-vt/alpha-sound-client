import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlbumService} from '../../service/album.service';
import {Album} from '../../model/album';
import {Page} from '../../model/page';
import {Subscription} from 'rxjs';
import {UserProfileService} from '../../service/user-profile.service';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {finalize} from 'rxjs/operators';
import {UserProfile} from '../../model/token-response';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  message: string;
  loading: boolean;
  disabled: boolean;
  albumList: Album[];
  subscription: Subscription = new Subscription();
  constructor(private albumService: AlbumService, private userService: UserProfileService,
              private songService: SongService, private playingQueueService: PlayingQueueService) {}

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber);
  }

  goToPage(i) {
    this.subscription.add(this.albumService.albumList(i)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
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
          this.message = 'An error has occurred.';
          console.log(error.message);
      }
    ));
  }

  addToPlaying(song) {
    this.playingQueueService.addToQueue(song);
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
