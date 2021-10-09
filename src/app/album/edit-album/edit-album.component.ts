import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlbumUploadData } from '../../model/album-upload-data';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { ArtistService } from '../../service/artist.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { DateUtil } from '../../util/date-util';
import { SongUploadData } from '../../model/song-upload-data';
import { AuthService } from '../../service/auth.service';
import { Song } from '../../model/song';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SongEditModalComponent } from '../../shared/component/song-edit-modal/song-edit-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AlbumEntryUpdate } from '../../model/album-entry-update';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.scss']
})
export class EditAlbumComponent implements OnInit, OnDestroy {
  albumId: number;
  albumUploadData: AlbumUploadData;
  subscription: Subscription = new Subscription();
  minDate = DateUtil.getMinDate();
  songUploadSubject: Subject<AlbumEntryUpdate>;
  loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastService: VgToastService,
    private loadingService: VgLoaderService
  ) {
    this.loading$ = this.loadingService.getLoader();
    this.albumUploadData = AlbumUploadData.instance({
      router,
      albumService
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.albumId = params.id;
          this.loadingService.loading(true);
          const result = await Promise.all([
            this.albumService.albumDetail(this.albumId).toPromise(),
            this.artistService.getAlbumArtistList(this.albumId, 0).toPromise(),
            this.songService.getAlbumSongList(this.albumId, 0).toPromise()
          ]);
          this.albumUploadData.album = result[0];
          this.albumUploadData.album.artists = result[1].content;
          this.albumUploadData.album.songs = result[2].content;
          const tmpSongUploadDataList = [];
          this.albumUploadData.album.songs.forEach(song => {
            const songUploadData = SongUploadData.instance(song);
            songUploadData.type = 'UPDATE';
            songUploadData.editable = this.authService.currentUserValue?.user_name === song.uploader?.username;
            tmpSongUploadDataList.push(songUploadData);
          });
          this.albumUploadData.songUploadDataList = tmpSongUploadDataList;
          this.albumUploadData.recycleBin = [];
          this.albumUploadData.checkEditableSongList(this.authService.currentUserValue.user_name);
        } catch (e) {
          console.error(e);
        } finally {
          this.loadingService.loading(false);
        }
      })
    );
  }

  async onSubmit(): Promise<void> {
    const albumFormData: FormData = this.albumUploadData.formData;
    const createAlbumResult = await this.albumService.updateAlbum(albumFormData, this.albumId).toPromise();
    this.toastService.success({ text: 'Album updated successfully' });
    if (this.songUploadSubject && !this.songUploadSubject.closed) {
      this.songUploadSubject.unsubscribe();
    }
    this.songUploadSubject = new Subject<AlbumEntryUpdate>();
    this.albumUploadData.waitAndProcessUploadSongList(createAlbumResult, this.songUploadSubject);
    for (const songUploadData of this.albumUploadData.songUploadDataList) {
      const songFormData: FormData = songUploadData.formData;
      if (songUploadData.type === 'UPDATE' && songUploadData.markForUpdate) {
        songUploadData.observable = this.songService.updateSong(songFormData, songUploadData.song?.id);
      } else if (songUploadData.type === 'CREATE') {
        songUploadData.observable = this.songService.uploadSong(songFormData);
      }
    }
  }

  onUploadSongSuccess(event: Song, songUploadData: SongUploadData): void {
    console.debug(event);
    this.toastService.success({ text: 'Song created/updated successfully' });
    songUploadData.song = {
      ...songUploadData.song,
      ...event
    };
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
        songUploadData.markForUpdate = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
