import { Component, OnInit } from '@angular/core';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { Album } from '../../model/album';
import { finalize } from 'rxjs/operators';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';

@Component({
  selector: 'app-uploaded-album-list',
  templateUrl: './uploaded-album-list.component.html',
  styleUrls: ['./uploaded-album-list.component.scss']
})
export class UploadedAlbumListComponent implements OnInit {
  albumPage: PagingInfo<Album> = DataUtil.initPagingInfo();
  loading: boolean;

  constructor(private albumService: AlbumService, private songService: SongService) {}

  ngOnInit(): void {
    this.getUserAlbumUploadedPage(0);
  }

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
    });
  }

  getUserAlbumUploadedPage(number: number): void {
    this.loading = true;
    this.albumService
      .getUserAlbumList(number)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result != null) {
          this.albumPage = result;
        }
      });
  }
}
