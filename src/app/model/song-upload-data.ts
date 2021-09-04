import { FormGroup } from '@angular/forms';
import { Artist } from './artist';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Song } from './song';

export class SongUploadData {
  public readonly formData: FormData;
  formGroup: FormGroup;
  filteredSongArtists: Artist[];
  observable?: Observable<HttpEvent<Song>> | null;
  type?: 'create' | 'update' = 'create';

  constructor(formGroup: FormGroup, filteredSongArtists: Artist[] = [], type: 'create' | 'update' = 'create') {
    this.formData = new FormData();
    this.formGroup = formGroup;
    this.filteredSongArtists = filteredSongArtists;
    this.type = type;
  }

  isValid(needUpload?: boolean): boolean {
    if (needUpload) return this.formData.get('audio') && this.formGroup.valid;
    return this.formGroup.valid;
  }

  setup(): FormData {
    this.formData.set('song', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    return this.formData;
  }
}
