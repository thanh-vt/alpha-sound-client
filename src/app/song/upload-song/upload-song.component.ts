import { Component } from '@angular/core';
import { ArtistService } from '../../service/artist.service';
import { VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';
import { SongService } from '../../service/song.service';
import { Song } from '../../model/song';
import { DateUtil } from '../../util/date-util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent {
  songUploadData: SongUploadData;
  minDate = DateUtil.getMinDate();

  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private router: Router,
    private toastService: VgToastService
  ) {
    this.songUploadData = SongUploadData.instance();
  }

  onUpload(): void {
    this.songUploadData.observable = this.songService.uploadSong(this.songUploadData.formData);
  }

  onUploadSuccess(song: Song): void {
    this.toastService.success({ text: 'Upload song successfully!' });
    setTimeout(() => {
      this.router.navigate(['song', 'detail'], { queryParams: { id: song.id } });
    }, 1500);
  }
}
