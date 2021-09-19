import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  album: Album;
  albumId: number;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private loaderService: VgLoaderService
  ) {}

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
