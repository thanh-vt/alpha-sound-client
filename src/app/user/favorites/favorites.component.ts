import { Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../model/song';
import { UserComponent } from '../user/user.component';
import { SongService } from '../../service/song.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  @ViewChild(UserComponent) userComponent: UserComponent;

  constructor(private songService: SongService, public translate: TranslateService, private loaderService: VgLoaderService) {}

  async ngOnInit(): Promise<void> {
    await this.getSongPage(0);
  }

  async getSongPage(number: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await firstValueFrom(this.songService.getUserFavoriteSongList({ page: number }));
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
