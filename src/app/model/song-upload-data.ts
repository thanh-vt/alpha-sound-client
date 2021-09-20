import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Artist } from './artist';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Song } from './song';

export type SongUploadType = 'create' | 'update' | 'view';

export class SongUploadData {
  public readonly formData: FormData;
  formGroup: FormGroup;
  filteredArtists: Artist[];
  observable?: Observable<HttpEvent<Song>> | null;
  type?: SongUploadType = 'create';
  editable?: boolean;
  editing?: boolean = true;
  checked?: boolean;
  temp: Song;

  constructor(formGroup: FormGroup, filteredSongArtists: Artist[] = [], type: SongUploadType = 'create') {
    this.formData = new FormData();
    this.formGroup = formGroup;
    this.filteredArtists = filteredSongArtists;
    this.type = type;
  }

  public static instance(fb: FormBuilder): SongUploadData {
    return new SongUploadData(
      fb.group({
        id: [null],
        title: ['', Validators.compose([Validators.required])],
        artists: fb.array([fb.control(null, Validators.compose([Validators.required]))]),
        releaseDate: ['', Validators.compose([Validators.required])],
        duration: [null],
        url: [null],
        uploader: [null],
        additionalInfo: [null]
      }),
      []
    );
  }

  public static createArtist(fb: FormBuilder): FormControl {
    return fb.control(null, [Validators.required]);
  }

  isValid(needUpload?: boolean): boolean {
    if (needUpload) {
      return this.formData.get('audio') && this.formGroup.valid;
    }
    return this.formGroup.valid;
  }

  setEditable(val: boolean): void {
    this.editable = val;
    this.setEditing(false);
  }

  setEditing(val: boolean): void {
    this.editing = val;
  }

  toggleEdit(): void {
    if (!this.editable) {
      return;
    }
    this.editing = !this.editing;
    if (this.editing) {
      this.temp = this.formGroup.getRawValue();
    } else {
      this.temp = null;
    }
  }

  resetForm(): void {
    if (this.temp) {
      this.formGroup.patchValue(this.temp);
    }
  }

  setup(): FormData {
    this.formData.set('song', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    return this.formData;
  }
}
