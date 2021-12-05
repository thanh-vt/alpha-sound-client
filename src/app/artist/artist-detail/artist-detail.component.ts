import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artist } from '../../model/artist';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../service/artist.service';
import { SongService } from '../../service/song.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Song } from '../../model/song';
import { TranslateService } from '@ngx-translate/core';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  artist: Artist;
  artistId: number;
  lastPageFetch = 0;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private artistService: ArtistService,
    private songService: SongService,
    public translate: TranslateService,
    private loaderService: VgLoaderService
  ) {}

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
      this.artist = await firstValueFrom(this.artistService.artistDetail(this.artistId));
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
      const tmpArr = (await firstValueFrom(this.artistService.getSongListOfArtist(this.artistId, page))).content;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
