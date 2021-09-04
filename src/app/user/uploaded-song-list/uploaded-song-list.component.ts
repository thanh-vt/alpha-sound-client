import { Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../model/song';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { SongService } from '../../service/song.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-uploaded-song-list',
  templateUrl: './uploaded-song-list.component.html',
  styleUrls: ['./uploaded-song-list.component.scss']
})
export class UploadedSongListComponent implements OnInit {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  @ViewChild(AddSongToPlaylistComponent) child: AddSongToPlaylistComponent;

  constructor(private songService: SongService, public translate: TranslateService, private loaderService: VgLoaderService) {}

  ngOnInit(): void {
    this.getUserSongUploadedPage(0);
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    song.isDisabled = true;
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  getUserSongUploadedPage(number: number): void {
    this.loaderService.loading(true);
    this.songService
      .getUploadedSongList(number)
      .pipe(
        finalize(() => {
          this.loaderService.loading(false);
        })
      )
      .subscribe(result => {
        this.songPage = result;
      });
  }
}
