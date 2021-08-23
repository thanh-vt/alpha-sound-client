import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../model/song';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { Page } from '../../model/page';
import { PlaylistService } from '../../service/playlist.service';
import { Subscription } from 'rxjs';
import { UserComponent } from '../../user/user/user.component';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  pages: Page[] = [];
  songList: Song[] = [];
  loading: boolean;
  Math: Math = Math;
  subscription: Subscription = new Subscription();

  @ViewChild(UserComponent) userComponent: UserComponent;

  constructor(
    private songService: SongService,
    private playingQueueService: PlayingQueueService,
    private playlistService: PlaylistService,
    public translate: TranslateService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.goToPage(this.pageNumber, true);
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(
      this.songService
        .getSongList({ page: i })
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          result => {
            if (result != null) {
              if (scrollUp) {
                window.scroll(0, 0);
              }
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
                this.pages[j] = { pageNumber: j };
              }
              for (const song of this.songList) {
                this.checkDisabledSong(song);
              }
            }
          },
          () => {
            for (const song of this.songList) {
              if (song.loadingLikeButton) {
                song.loadingLikeButton = false;
              }
            }
          }
        )
    );
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  likeSong(song: Song, event, isLiked: boolean) {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
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

  openPlaylistDialog(songId: number, event: Event) {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
