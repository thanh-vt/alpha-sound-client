import { SongUploadData } from '../model/song-upload-data';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlbumUploadData } from '../model/album-upload-data';
import { ArtistService } from '../service/artist.service';
import { AlbumUpdate } from '../model/album-update';
import { Subject } from 'rxjs';
import { AlbumService } from '../service/album.service';
import { Album } from '../model/album';
import { Router } from '@angular/router';
import { Song } from '../model/song';
import { HttpErrorResponse } from '@angular/common/http';

export abstract class BaseUploadComponent {
  protected constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected artistService: ArtistService,
    protected albumService: AlbumService
  ) {}

  protected getAlbumUploadData(): AlbumUploadData {
    return null;
  }

  protected getSongUploadDataList(): SongUploadData[] {
    return [];
  }

  protected getHolder(): AlbumUpdate[] {
    return [];
  }

  protected getSongUploadSubject(): Subject<AlbumUpdate> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setSongUploadSubject(subject: Subject<AlbumUpdate>): void {
    // do nothing
  }

  initAlbumUploadData(): AlbumUploadData {
    return new AlbumUploadData(
      this.fb.group({
        id: [null],
        title: ['', Validators.compose([Validators.required])],
        artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
        releaseDate: ['', Validators.compose([Validators.required])],
        genres: [null],
        tags: [null],
        country: [null],
        theme: [null],
        coverUrl: [null]
      }),
      []
    );
  }

  initSongUploadData(): SongUploadData {
    return new SongUploadData(
      this.fb.group({
        id: [null],
        title: ['', Validators.compose([Validators.required])],
        artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
        releaseDate: ['', Validators.compose([Validators.required])],
        album: [null],
        genres: [null],
        tags: [null],
        country: [null],
        theme: [null],
        duration: [null],
        url: [null]
      }),
      []
    );
  }

  initSongUploadDataList(): SongUploadData[] {
    return [this.initSongUploadData()];
  }

  addForm(): void {
    if (this.getSongUploadDataList().length < 20) {
      this.getSongUploadDataList().push(
        new SongUploadData(
          this.fb.group({
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

  createArtist(): FormControl {
    return this.fb.control(null, { validators: [Validators.required] });
  }

  getAlbumArtists(): FormArray {
    return this.getAlbumUploadData().formGroup.get('artists') as FormArray;
  }

  getSongArtists(i: number): FormArray {
    return this.getSongUploadDataList()[i].formGroup.get('artists') as FormArray;
  }

  addAlbumArtist(): void {
    this.getAlbumArtists().push(this.createArtist());
  }

  removeAlbumArtist(index: number): void {
    this.getAlbumArtists().removeAt(index);
  }

  addSongArtist(i: number): void {
    this.getSongArtists(i).push(this.createArtist());
  }

  removeSongArtist(i: number, index: number): void {
    this.getSongArtists(i).removeAt(index);
  }

  retrieveSongDuration(event: Event, formGroup: FormGroup): void {
    const target = event.target as HTMLAudioElement;
    formGroup.get('duration').setValue(target.duration);
  }

  removeForm(i: number): void {
    if (this.getSongUploadDataList().length > 1) {
      const markForDeleteId = this.getSongUploadDataList()[i].formGroup.get('id').value;
      if (markForDeleteId >= 0) {
        this.getHolder().push({
          songId: markForDeleteId,
          order: null,
          mode: 'DELETE'
        });
      }
      this.getSongUploadDataList().splice(i, 1);
    }
  }

  suggestAlbumArtist(value: string): void {
    this.artistService.searchArtistByName(value).subscribe(artists => {
      this.getAlbumUploadData().filteredAlbumArtists = artists;
    });
  }

  suggestSongArtist(value: string, songIndex: number): void {
    this.artistService.searchArtistByName(value).subscribe(artists => {
      this.getSongUploadDataList()[songIndex].filteredSongArtists = artists;
    });
  }

  uploadSongSuccess(event: Song, songUploadData: SongUploadData, j: number): void {
    this.getSongUploadSubject().next(songUploadData.type === 'create' ? { songId: event.id, order: j, mode: 'CREATE' } : null);
  }

  uploadSongFailed(event: HttpErrorResponse): void {
    console.error(event);
    this.getSongUploadSubject().next(null);
  }

  waitAndProcessUploadSongList(createAlbumResult: Album): void {
    const totalForm = this.getSongUploadDataList().length;
    let count = 0;
    this.setSongUploadSubject(new Subject());
    const sub = this.getSongUploadSubject().subscribe(async next => {
      if (next) {
        this.getHolder().push(next);
      }
      count++;
      if (count === totalForm) {
        await this.albumService.updateSongList(this.getHolder(), createAlbumResult.id).toPromise();
        sub.unsubscribe();
        setTimeout(() => {
          this.router.navigate(['album', 'detail'], { queryParams: { id: createAlbumResult.id } });
        });
        return;
      }
    });
  }
}
