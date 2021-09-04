import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../model/song';
import { PlaylistService } from '../../service/playlist.service';
import { Observable, Subscription } from 'rxjs';
import { UserComponent } from '../../user/user/user.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../service/auth.service';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { UserProfile } from '../../model/token-response';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  @ViewChild(UserComponent) userComponent: UserComponent;
  currentUser$: Observable<UserProfile> = this.authService.currentUser$;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    public translate: TranslateService,
    private authService: AuthService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getSongPage(0, true);
  }

  async getSongPage(i: number, scrollUp?: boolean): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.songList({ page: i }).toPromise();
      if (scrollUp) {
        window.scroll(0, 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  likeSong(song: Song, event: Event, isLiked: boolean): void {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
  }

  openPlaylistDialog(songId: number, event: Event): void {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
