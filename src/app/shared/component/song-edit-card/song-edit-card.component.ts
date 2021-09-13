import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { DateUtil } from '../../../util/date-util';
import { Song } from '../../../model/song';
import { Country } from '../../../model/country';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CountryService } from '../../../service/country.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-song-edit-card',
  templateUrl: './song-edit-card.component.html',
  styleUrls: ['./song-edit-card.component.scss']
})
export class SongEditCardComponent {
  @Input() songId: number;
  @Input() isSubmittable!: boolean;
  @Input() songUploadData!: SongUploadData;
  countryList$: Observable<Country[]>;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() uploadSuccessEvent: EventEmitter<Song> = new EventEmitter<Song>();
  minDate = DateUtil.getMinDate();
  compareCountries = (country1: Country, country2: Country): boolean => {
    return country1?.id === country2?.id;
  };

  constructor(private countryService: CountryService) {
    this.countryList$ = this.countryService.countryList$;
  }

  onSubmit(): void {
    if (this.isSubmittable) {
      this.submitEvent.emit();
    }
  }

  onUploadSuccess(event: Song): void {
    if (this.isSubmittable) {
      this.uploadSuccessEvent.emit(event);
    }
  }

  setMetadata(event: Event, formGroup: FormGroup): void {
    const target = event.target as HTMLAudioElement;
    formGroup.get('duration').setValue(target.duration);
  }
}
