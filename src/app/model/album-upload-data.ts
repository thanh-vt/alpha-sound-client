import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artist } from './artist';
import { SongUploadData } from './song-upload-data';
import { HttpErrorResponse } from '@angular/common/http';
import { Album } from './album';
import { Subject } from 'rxjs';
import { AlbumUpdate } from './album-update';
import { Router } from '@angular/router';
import { AlbumService } from '../service/album.service';

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
      artists: instance.fb.array([instance.fb.control(null, Validators.compose([Validators.required]))]),
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

  addForm(): void {
    if (this.songUploadDataList.length < 20) {
      this.songUploadDataList.push(
        new SongUploadData(
          this.fb.group({
            id: [null],
            title: ['', Validators.compose([Validators.required])],
            artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
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
        )
      );
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

  waitAndProcessUploadSongList(createAlbumResult: Album): void {
    const totalForm = this.songUploadDataList.length;
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
}
