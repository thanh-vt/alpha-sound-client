import { FormGroup } from '@angular/forms';
import { Artist } from './artist';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

export class SongUploadData {
  private readonly formData: FormData;
  formGroup: FormGroup;
  filteredSongArtists: Artist[];
  observable?: Observable<HttpEvent<never>> | null;
  audioFile?: File | null;

  constructor(formGroup: FormGroup, filteredSongArtists: Artist[] = []) {
    this.formData = new FormData();
    this.formGroup = formGroup;
    this.filteredSongArtists = filteredSongArtists;
  }

  isValid(): boolean {
    return this.audioFile && this.formGroup.valid;
  }

  setup(): FormData {
    if (this.formGroup.invalid || !this.audioFile) {
      return null;
    }
    this.formData.set('song', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    this.formData.set('audio', this.audioFile);
    return this.formData;
  }
}
