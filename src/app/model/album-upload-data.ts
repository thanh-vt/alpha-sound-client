import { FormGroup } from '@angular/forms';
import { Artist } from './artist';

export class AlbumUploadData {
  public readonly formData: FormData;
  formGroup: FormGroup;
  filteredAlbumArtists: Artist[];

  constructor(formGroup: FormGroup, filteredSongArtists: Artist[] = []) {
    this.formData = new FormData();
    this.formGroup = formGroup;
    this.filteredAlbumArtists = filteredSongArtists;
  }

  isValid(needUpload?: boolean): boolean {
    if (needUpload) return this.formData.get('cover') && this.formGroup.valid;
    return this.formGroup.valid;
  }

  setup(): FormData {
    this.formData.set('album', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    return this.formData;
  }
}
