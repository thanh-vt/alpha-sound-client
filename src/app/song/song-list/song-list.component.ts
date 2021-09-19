import { Component, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../model/song';
import { UserComponent } from '../../user/user/user.component';
import { TranslateService } from '@ngx-translate/core';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();

  @ViewChild(UserComponent) userComponent: UserComponent;

  constructor(private songService: SongService, public translate: TranslateService, private loaderService: VgLoaderService) {}

  async ngOnInit(): Promise<void> {
    await this.getSongPage(0, true);
  }

  async getSongPage(i: number, scrollUp?: boolean): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.songList({ page: i }).toPromise();
      if (scrollUp) {
        window.scroll(0, 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
