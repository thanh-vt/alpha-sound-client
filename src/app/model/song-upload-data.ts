import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Artist } from './artist';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Song } from './song';

export type SongUploadType = 'CREATE' | 'UPDATE' | 'VIEW' | 'DELETE';

export class SongUploadData {
  public readonly formData: FormData;
  song: Song;
  filteredArtists: Artist[];
  observable?: Observable<HttpEvent<Song>> | null;
  type?: SongUploadType = 'CREATE';
  editable?: boolean;
  markForUpdate?: boolean;
  ordinalNumber?: number;
  loading?: boolean;

  constructor(type: SongUploadType = 'CREATE', song?: Song) {
    this.formData = new FormData();
    this.filteredArtists = [];
    this.song = song;
    this.type = type;
  }

  public static instance(song?: Song): SongUploadData {
    return new SongUploadData('CREATE', song);
  }

  public static createArtist(fb: FormBuilder): FormControl {
    return fb.control(null, [Validators.required]);
  }

  setEditable(val: boolean): void {
    this.editable = val;
  }
}
