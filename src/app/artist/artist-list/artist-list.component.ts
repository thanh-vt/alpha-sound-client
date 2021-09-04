import { Component, OnInit } from '@angular/core';
import { Artist } from '../../model/artist';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo();

  constructor(private artistService: ArtistService, private loaderService: VgLoaderService) {}

  async ngOnInit(): Promise<void> {
    await this.getArtistPage(0);
  }

  async getArtistPage(number: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.artistPage = await this.artistService.artistList(number).toPromise();
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
