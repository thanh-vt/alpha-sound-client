import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artist } from '../../../model/artist';
import { Song } from '../../../model/song';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../service/artist.service';
import { SongService } from '../../../service/song.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  artist: Artist;
  artistId: number;
  lastPageFetched = 0;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private songService: SongService,
    public translate: TranslateService,
    private modalService: NgbModal,
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
      await this.getSongListOfArtist(this.lastPageFetched);
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
      const tmpArr = await firstValueFrom(this.artistService.getSongListOfArtist(this.artistId, page));
      this.songPage.content = this.songPage.content.concat(tmpArr.content);
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  async onScroll(): Promise<void> {
    if (this.lastPageFetched < this.songPage.totalPages) {
      this.lastPageFetched++;
    }
    await this.artistService.getSongListOfArtist(this.artistId, this.lastPageFetched);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
