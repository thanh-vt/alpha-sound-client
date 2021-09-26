import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../service/album.service';
import { Album } from '../../model/album';
import { SongService } from '../../service/song.service';
import { finalize } from 'rxjs/operators';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/token-response';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  currentUser$: Observable<UserProfile>;
  albumPage: PagingInfo<Album> = DataUtil.initPagingInfo();

  constructor(
    private albumService: AlbumService,
    private songService: SongService,
    private authService: AuthService,
    private loaderService: VgLoaderService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.getAlbumPage(0);
  }

  getAlbumPage(page: number): void {
    DataUtil.scrollToTop();
    this.loaderService.loading(true);
    this.albumService
      .albumList(page)
      .pipe(
        finalize(() => {
          this.loaderService.loading(false);
        })
      )
      .subscribe(result => {
        this.albumPage = result;
      });
  }

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
    });
  }
}
