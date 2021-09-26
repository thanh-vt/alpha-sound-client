import { Component, OnInit } from '@angular/core';
import { Artist } from '../../model/artist';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {
  currentUser$: Observable<UserProfile>;
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo();

  constructor(private artistService: ArtistService, private authService: AuthService, private loaderService: VgLoaderService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  async ngOnInit(): Promise<void> {
    await this.getArtistPage(0);
  }

  async getArtistPage(number: number): Promise<void> {
    try {
      DataUtil.scrollToTop();
      this.loaderService.loading(true);
      this.artistPage = await this.artistService.artistList(number).toPromise();
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
