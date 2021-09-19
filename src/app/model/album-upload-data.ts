import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artist } from './artist';
import { SongUploadData } from './song-upload-data';
import { HttpErrorResponse } from '@angular/common/http';
import { Album } from './album';
import { Subject } from 'rxjs';
import { AlbumUpdate } from './album-update';
import { Router } from '@angular/router';
import { AlbumService } from '../service/album.service';
import { UserInfo } from './user-info';

export type AlbumUploadOptions = {
  fb: FormBuilder;
  router: Router;
  albumService: AlbumService;
};

export class AlbumUploadData {
  public formData: FormData;
  formGroup: FormGroup;
  filteredArtists: Artist[];
  public songUploadDataList: SongUploadData[] = [];
  public holder: AlbumUpdate[] = [];
  public songUploadSubject: Subject<AlbumUpdate> = new Subject<AlbumUpdate>();
  private fb: FormBuilder;
  private router: Router;
  private albumService: AlbumService;
  editable?: boolean;
  editing = true;
  checked?: boolean;

  constructor(fb: FormBuilder, router: Router, albumService: AlbumService) {
    this.fb = fb;
    this.router = router;
    this.albumService = albumService;
  }

  isValid(needUpload?: boolean): boolean {
    if (needUpload) {
      return this.formData.get('cover') && this.formGroup.valid;
    }
    return this.formGroup.valid;
  }

  setup(): FormData {
    this.formData.set('album', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    return this.formData;
  }

  public static instance(options: AlbumUploadOptions): AlbumUploadData {
    const instance: AlbumUploadData = new AlbumUploadData(options.fb, options.router, options.albumService);
    instance.formGroup = instance.fb.group({
      id: [null],
      title: ['', Validators.compose([Validators.required])],
      artists: instance.fb.array([instance.fb.control(null, Validators.required)]),
      releaseDate: ['', Validators.compose([Validators.required])],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null],
      coverUrl: [null]
    });
    instance.formData = new FormData();
    instance.filteredArtists = [];
    instance.initSongUploadDataList(instance.fb);
    return instance;
  }

  initSongUploadDataList(fb: FormBuilder): SongUploadData[] {
    return [SongUploadData.instance(fb)];
  }

  checkEditableSongList(username: string): void {
    this.songUploadDataList.forEach(songUploadData => {
      const songOwner = (songUploadData.formGroup.get('uploader').value as UserInfo)?.username;
      songUploadData.setEditable(songOwner === username);
    });
  }

  addForm(songUploadData?: SongUploadData): void {
    if (this.songUploadDataList.length < 20) {
      if (!songUploadData) {
        songUploadData = new SongUploadData(
          this.fb.group({
            id: [null],
            title: ['', Validators.compose([Validators.required])],
            artists: this.fb.array([this.fb.control(null, Validators.required)]),
            releaseDate: ['', Validators.compose([Validators.required])],
            album: [''],
            genres: [null],
            tags: [null],
            country: [null],
            theme: [null],
            duration: [null],
            url: [null]
          }),
          [],
          'create'
        );
      }
      this.songUploadDataList.push(songUploadData);
    }
  }

  removeForm(i: number): void {
    if (this.songUploadDataList.length > 1) {
      const markForDeleteId = this.songUploadDataList[i].formGroup.get('id').value;
      if (markForDeleteId >= 0) {
        this.holder.push({
          songId: markForDeleteId,
          order: null,
          mode: 'DELETE'
        });
      }
      this.songUploadDataList.splice(i, 1);
    }
  }

  uploadSongFailed(event: HttpErrorResponse): void {
    console.error(event);
    this.songUploadSubject.next(null);
  }

  waitAndProcessUploadSongList(createAlbumResult: Album, countChecked?: boolean): void {
    let totalForm;
    if (countChecked) {
      totalForm = this.songUploadDataList.filter(songUploadData => songUploadData.checked).length;
    } else {
      totalForm = this.songUploadDataList.length;
    }
    let count = 0;
    const sub = this.songUploadSubject.subscribe(async next => {
      if (next) {
        this.holder.push(next);
      }
      count++;
      if (count === totalForm) {
        await this.albumService.updateSongList(this.holder, createAlbumResult.id).toPromise();
        sub.unsubscribe();
        setTimeout(() => {
          this.router.navigate(['album', 'detail'], { queryParams: { id: createAlbumResult.id } });
        });
        return;
      }
    });
  }

  checkAlbumUploadData(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.songUploadDataList.forEach(songUploadData => {
      songUploadData.checked = this.checked;
    });
  }

  checkSongUploadData(event: Event, index: number): void {
    const songUploadData = this.songUploadDataList[index];
    songUploadData.checked = (event.target as HTMLInputElement).checked;
    this.checked = this.songUploadDataList.map(songUploadData => songUploadData.checked).every(val => val === true);
    console.log(this.checked);
  }
}
