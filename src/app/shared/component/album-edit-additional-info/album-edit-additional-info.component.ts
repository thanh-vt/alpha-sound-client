import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country } from '../../../model/country';
import { Genre } from '../../../model/genre';
import { Theme } from '../../../model/theme';
import { CountryService } from '../../../service/country.service';
import { GenreService } from '../../../service/genre.service';
import { ThemeService } from '../../../service/theme.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlbumService } from '../../../service/album.service';
import { Album } from '../../../model/album';

@Component({
  selector: 'app-album-edit-additional-info',
  templateUrl: './album-edit-additional-info.component.html',
  styleUrls: ['./album-edit-additional-info.component.scss']
})
export class AlbumEditAdditionalInfoComponent implements OnInit {
  formAdditionalInfo: FormGroup = this.fb.group({
    country: [null],
    description: [null],
    genres: [[]],
    tags: [[]],
    theme: [null]
  });
  countryList$: Observable<Country[]>;
  genreList$: Observable<Genre[]>;
  themeList$: Observable<Theme[]>;
  @Input() additionalInfo: Album;
  @Input() albumId!: number;

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
    private albumService: AlbumService,
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
    if (this.albumId) {
      this.albumService.albumAdditionalInfo(this.albumId).subscribe(next => {
        this.formAdditionalInfo.patchValue({
          ...next,
          ...this.additionalInfo
        });
      });
    } else if (this.additionalInfo) {
      this.formAdditionalInfo.patchValue(this.additionalInfo);
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
