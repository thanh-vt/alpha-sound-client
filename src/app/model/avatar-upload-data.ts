import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Artist } from './artist';

export class ArtistUploadData {
  public readonly formData: FormData;
  formGroup: FormGroup;
  observable?: Observable<HttpEvent<Artist>> | null;

  constructor(formGroup: FormGroup) {
    this.formData = new FormData();
    this.formGroup = formGroup;
  }

  isValid(needUpload?: boolean): boolean {
    if (needUpload) return this.formData.get('avatar') && this.formGroup.valid;
    return this.formGroup.valid;
  }

  setup(): FormData {
    this.formData.set('artist', new Blob([JSON.stringify(this.formGroup.getRawValue())], { type: 'application/json' }));
    return this.formData;
  }
}
