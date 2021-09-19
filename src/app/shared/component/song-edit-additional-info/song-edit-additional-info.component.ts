import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country } from '../../../model/country';
import { CountryService } from '../../../service/country.service';
import { Theme } from '../../../model/theme';
import { ThemeService } from '../../../service/theme.service';
import { Genre } from '../../../model/genre';
import { GenreService } from '../../../service/genre.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SongService } from '../../../service/song.service';

@Component({
  selector: 'app-song-edit-additional-info',
  templateUrl: './song-edit-additional-info.component.html',
  styleUrls: ['./song-edit-additional-info.component.scss']
})
export class SongEditAdditionalInfoComponent implements OnInit {
  formAdditionalInfo: FormGroup = this.fb.group({
    country: [null],
    lyric: [null],
    genres: [[]],
    tags: [[]],
    theme: [null]
  });
  countryList$: Observable<Country[]>;
  genreList$: Observable<Genre[]>;
  themeList$: Observable<Theme[]>;
  @Input() songId!: number;

  compareCountries = (country1: Country, country2: Country): boolean => {
    return country1?.id === country2?.id;
  };
  compareGenres = (genre1: Genre, genre2: Genre): boolean => {
    return genre1?.id === genre2?.id;
  };
  compareThemes = (theme1: Theme, theme2: Theme): boolean => {
    return theme1?.id === theme2?.id;
  };

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private countryService: CountryService,
    private genreService: GenreService,
    private themeService: ThemeService,
    private ngbActiveModal: NgbActiveModal
  ) {
    this.countryList$ = this.countryService.countryList$;
    this.genreList$ = this.genreService.genreList$;
    this.themeList$ = this.themeService.themeList$;
  }

  ngOnInit(): void {
    if (this.songId) {
      this.songService.songAdditionalInfo(this.songId).subscribe(next => {
        this.formAdditionalInfo.patchValue(next);
      });
    }
  }

  save(): void {
    this.formAdditionalInfo.markAllAsTouched();
    if (this.formAdditionalInfo.invalid) {
      return;
    }
    this.ngbActiveModal.close(this.formAdditionalInfo.getRawValue());
  }

  close(): void {
    this.ngbActiveModal.close();
  }
}
