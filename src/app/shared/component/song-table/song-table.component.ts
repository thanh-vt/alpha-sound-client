import { Component, Input, OnInit } from '@angular/core';
import { PagingInfo } from '../../../model/paging-info';
import { Song } from '../../../model/song';
import { DataUtil } from '../../../util/data-util';
import { SongService } from '../../../service/song.service';
import { TranslateService } from '@ngx-translate/core';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';

@Component({
  selector: 'app-song-table',
  templateUrl: './song-table.component.html',
  styleUrls: ['./song-table.component.scss']
})
export class SongTableComponent implements OnInit {
  @Input() paramsFetch: { [key: string]: string };
  currentUser$: Observable<UserProfile>;
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();

  constructor(
    private authService: AuthService,
    private songService: SongService,
    public translate: TranslateService,
    private loaderService: VgLoaderService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  async ngOnInit(): Promise<void> {
    await this.getSongPage(0, true);
  }

  async getSongPage(i: number, scrollUp?: boolean): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songPage = await this.songService.songList({ ...this.paramsFetch, page: i }).toPromise();
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
