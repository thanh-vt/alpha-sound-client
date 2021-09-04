import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artist } from '../../model/artist';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ArtistService } from '../../service/artist.service';
import { SongService } from '../../service/song.service';
import { Subscription } from 'rxjs';
import { Song } from '../../model/song';
import { PlaylistService } from '../../service/playlist.service';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  artist: Artist;
  artistId: number;
  lastPageFetch = 0;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private artistService: ArtistService,
    private songService: SongService,
    private playlistService: PlaylistService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {
    this.authService.currentUser$.subscribe(next => {
      this.currentUser = next;
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        this.artistId = params.id;
        await this.getArtistDetail();
      })
    );
  }

  async getArtistDetail(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.artist = await this.artistService.artistDetail(this.artistId).toPromise();
      await this.getSongListOfArtist(this.lastPageFetch);
      window.scroll(0, 0);
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  async getSongListOfArtist(page: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      const tmpArr = (await this.artistService.getSongListOfArtist(this.artistId, page).toPromise()).content;
      this.songPage.content = this.songPage.content.concat(tmpArr);
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  async onScroll(): Promise<void> {
    this.lastPageFetch++;
    await this.getSongListOfArtist(this.lastPageFetch);
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  likeSong(song: Song, index: number, event: Event, isLiked: boolean): void {
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
