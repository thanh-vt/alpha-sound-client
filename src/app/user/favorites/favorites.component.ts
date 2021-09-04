import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../model/song';
import { Subscription } from 'rxjs';
import { UserComponent } from '../user/user.component';
import { SongService } from '../../service/song.service';
import { PlaylistService } from '../../service/playlist.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../service/auth.service';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();
  @ViewChild(UserComponent) userComponent: UserComponent;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    public translate: TranslateService,
    private authService: AuthService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getSongPage(0);
  }

  async getSongPage(number: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.getUserFavoriteSongList({ page: number }).toPromise();
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
