import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../service/song.service';
import { Album } from '../../model/album';
import { AlbumService } from '../../service/album.service';
import { Song } from '../../model/song';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { Artist } from '../../model/artist';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile>;
  album: Album;
  albumId: number;
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo(5);
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private authService: AuthService,
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
          const result = await Promise.all([
            this.albumService.albumDetail(this.albumId).toPromise(),
            this.albumService.albumAdditionalInfo(this.albumId).toPromise(),
            this.getArtistPage(0),
            this.getSongPage(0)
          ]);
          this.album = {
            ...result[0],
            ...result[1]
          };
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      })
    );
  }

  async getArtistPage(page: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.artistPage = await this.artistService.getAlbumArtistList(this.albumId, page, 10).toPromise();
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  async getSongPage(page: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.getAlbumSongList(this.albumId, page, 10).toPromise();
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
