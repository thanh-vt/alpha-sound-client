import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../service/song.service';
import { Artist } from '../../model/artist';
import { Song } from '../../model/song';
import { firstValueFrom, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit, OnDestroy {
  song: Song;
  songId: number;
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo(5);

  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private songService: SongService,
    private artistService: ArtistService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {}

  ngOnInit(): void {
    this.retrieveSongList();
  }

  retrieveSongList(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.songId = params.id;
          this.loaderService.loading(true);
          // eslint-disable-next-line
          const songInfo: any[] = await Promise.all([
            firstValueFrom(this.songService.songDetail(this.songId)),
            firstValueFrom(this.songService.songAdditionalInfo(this.songId)),
            this.getArtistList()
          ]);
          this.song = {
            ...songInfo[0],
            ...songInfo[1]
          };
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      })
    );
  }

  async getArtistList(page = 0): Promise<void> {
    this.artistPage = await firstValueFrom(
      this.artistService.searchArtist({
        songId: `${this.songId}`,
        page: `${page}`,
        size: `${this.artistPage.pageable?.pageSize}`
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
