import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../service/album.service';
import { Album } from '../../model/album';
import { SongService } from '../../service/song.service';
import { finalize } from 'rxjs/operators';
import { Song } from '../../model/song';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  albumPage: PagingInfo<Album> = DataUtil.initPagingInfo();

  constructor(private albumService: AlbumService, private songService: SongService, private loaderService: VgLoaderService) {}

  ngOnInit(): void {
    this.getAlbumPage(0);
  }

  getAlbumPage(page: number): void {
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

  addToPlaying(song: Song): void {
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
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
