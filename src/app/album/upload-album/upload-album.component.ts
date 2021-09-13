import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArtistService } from '../../service/artist.service';
import { AlbumUploadData } from '../../model/album-upload-data';
import { VgToastService } from 'ngx-vengeance-lib';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { DateUtil } from '../../util/date-util';
import { Router } from '@angular/router';
import { SongUploadData } from '../../model/song-upload-data';
import { Artist } from '../../model/artist';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent {
  albumUploadData: AlbumUploadData;
  minDate = DateUtil.getMinDate();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private toastService: VgToastService
  ) {
    this.albumUploadData = AlbumUploadData.instance({
      fb,
      router,
      albumService
    });
  }

  async onSubmit(): Promise<void> {
    let isSongFormsValid = true;
    for (const songUploadData of this.albumUploadData.songUploadDataList) {
      if (!songUploadData.isValid()) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumUploadData.isValid() && isSongFormsValid) {
      const albumFormData: FormData = this.albumUploadData.setup();
      const createAlbumResult = await this.albumService.uploadAlbum(albumFormData).toPromise();
      this.toastService.success({ text: 'Album created successfully' });
      this.albumUploadData.waitAndProcessUploadSongList(createAlbumResult);
      for (const songUploadData of this.albumUploadData.songUploadDataList) {
        const songFormData: FormData = songUploadData.setup();
        songUploadData.observable = this.songService.uploadSong(songFormData);
      }
    }
  }
}
