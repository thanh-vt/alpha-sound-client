import { FormGroup } from '@angular/forms';
import { Artist } from './artist';

export class AlbumUploadData {
  private readonly formData: FormData;
  formGroup: FormGroup;
  filteredAlbumArtists: Artist[];
  imageFile?: File | null;

  constructor(formGroup: FormGroup, filteredSongArtists: Artist[] = []) {
    this.formData = new FormData();
    this.formGroup = formGroup;
    this.filteredAlbumArtists = filteredSongArtists;
  }

  isValid(): boolean {
    return this.imageFile && this.formGroup.valid;
  }

  setup(): FormData {
    if (this.formGroup.invalid || !this.imageFile) {
      return null;
    }
    this.formData.set('album', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    this.formData.set('cover', this.imageFile);
    return this.formData;
  }
}
