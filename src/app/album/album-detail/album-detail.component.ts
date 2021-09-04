import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';
import { Album } from '../../model/album';
import { AlbumService } from '../../service/album.service';
import { Song } from '../../model/song';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile>;
  album: Album;
  albumId: number;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.loaderService.loading(true);
          this.albumId = params.id;
          this.album = await this.albumService.albumDetail(this.albumId).toPromise();
          await this.getSongPage(0);
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      })
    );
  }

  async getSongPage(number: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.getAlbumSongList(this.album.id, number, 10).toPromise();
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

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
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
