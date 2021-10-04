import { Component } from '@angular/core';
import { ArtistService } from '../../service/artist.service';
import { AlbumUploadData } from '../../model/album-upload-data';
import { VgToastService } from 'ngx-vengeance-lib';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { DateUtil } from '../../util/date-util';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AlbumEntryUpdate } from '../../model/album-entry-update';
import { Song } from '../../model/song';
import { HttpErrorResponse } from '@angular/common/http';
import { SongUploadData } from '../../model/song-upload-data';
import { SongEditModalComponent } from '../../shared/component/song-edit-modal/song-edit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent {
  albumUploadData: AlbumUploadData;
  minDate = DateUtil.getMinDate();
  songUploadSubject: Subject<AlbumEntryUpdate>;

  constructor(
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private toastService: VgToastService,
    private modalService: NgbModal
  ) {
    this.albumUploadData = AlbumUploadData.instance({
      router,
      albumService
    });
  }

  onUploadSongSuccess(event: Song): void {
    console.log(event);
    this.toastService.success({ text: 'Song created/updated successfully' });
    this.songUploadSubject.next(null);
  }

  uploadSongFailed(event: HttpErrorResponse): void {
    console.error(event);
    this.songUploadSubject.next(null);
  }

  toggleEdit(songUploadData: SongUploadData): void {
    const ref = this.modalService.open(SongEditModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const instance: SongEditModalComponent = ref.componentInstance;
    instance.song = songUploadData.song;
    instance.songUploadData = songUploadData;
    ref.closed.subscribe(song => {
      if (song) {
        songUploadData.song = song;
        songUploadData.markForUpdate = false;
      }
    });
  }

  async onSubmit(): Promise<void> {
    const albumFormData: FormData = this.albumUploadData.formData;
    const createAlbumResult = await this.albumService.uploadAlbum(albumFormData).toPromise();
    this.toastService.success({ text: 'Album created successfully' });
    if (this.songUploadSubject && !this.songUploadSubject.closed) {
      this.songUploadSubject.unsubscribe();
    }
    this.songUploadSubject = new Subject<AlbumEntryUpdate>();
    this.albumUploadData.waitAndProcessUploadSongList(createAlbumResult, this.songUploadSubject);
    for (const songUploadData of this.albumUploadData.songUploadDataList) {
      songUploadData.observable = this.songService.uploadSong(songUploadData.formData);
    }
  }
}
