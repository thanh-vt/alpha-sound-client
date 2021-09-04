import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ArtistService } from '../../service/artist.service';
import { SongUploadData } from 'src/app/model/song-upload-data';
import { AlbumUploadData } from '../../model/album-upload-data';
import { VgToastService } from 'ngx-vengeance-lib';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { artistModelToImgSrcMapper, artistModelToTextMapper } from 'src/app/util/mapper.util';
import { BaseUploadComponent } from '../../common/base-upload.component';
import { DateUtil } from '../../util/date-util';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Song } from '../../model/song';
import { AlbumUpdate } from '../../model/album-update';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent extends BaseUploadComponent {
  modelToTextMapper = artistModelToTextMapper;
  modelToImgSrcMapper = artistModelToImgSrcMapper;
  albumUploadData: AlbumUploadData = this.initAlbumUploadData();
  songUploadDataList: SongUploadData[] = this.initSongUploadDataList();
  minDate = DateUtil.getMinDate();
  holder: AlbumUpdate[] = [];
  songUploadSubject: Subject<AlbumUpdate> = new Subject<AlbumUpdate>();

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected albumService: AlbumService,
    private songService: SongService,
    protected artistService: ArtistService,
    private toastService: VgToastService
  ) {
    super(fb, router, artistService, albumService);
  }

  protected getAlbumUploadData(): AlbumUploadData {
    return this.albumUploadData;
  }

  protected getSongUploadDataList(): SongUploadData[] {
    return this.songUploadDataList;
  }

  protected getHolder(): AlbumUpdate[] {
    return this.holder;
  }

  protected getSongUploadSubject(): Subject<AlbumUpdate> {
    return super.getSongUploadSubject();
  }

  protected setSongUploadSubject(subject: Subject<AlbumUpdate>): void {
    this.songUploadSubject = subject;
  }

  async onSubmit(): Promise<void> {
    let isSongFormsValid = true;
    for (const songUploadData of this.songUploadDataList) {
      if (!songUploadData.isValid()) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumUploadData.isValid() && isSongFormsValid) {
      const albumFormData: FormData = this.albumUploadData.setup();
      const createAlbumResult = await this.albumService.uploadAlbum(albumFormData).toPromise();
      this.toastService.success({ text: 'Album created successfully' });
      this.waitAndProcessUploadSongList(createAlbumResult);
      for (const songUploadData of this.songUploadDataList) {
        const songFormData: FormData = songUploadData.setup();
        songUploadData.observable = this.songService.uploadSong(songFormData);
      }
    }
  }

  suggestAlbumArtist(value: string): void {
    this.artistService.searchArtistByName(value).subscribe(artists => {
      this.albumUploadData.filteredAlbumArtists = artists;
    });
  }

  suggestSongArtist(value: string, songIndex: number): void {
    this.artistService.searchArtistByName(value).subscribe(artists => {
      this.songUploadDataList[songIndex].filteredSongArtists = artists;
    });
  }
}
