import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ArtistService } from '../../service/artist.service';
import { finalize } from 'rxjs/operators';
import { CountryService } from '../../service/country.service';
import { Country } from '../../model/country';
import { VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';
import { SongService } from '../../service/song.service';
import { artistModelToImgSrcMapper, artistModelToTextMapper } from '../../util/mapper.util';
import { Router } from '@angular/router';
import { Song } from '../../model/song';
import { BaseUploadComponent } from '../../common/base-upload.component';
import { DateUtil } from '../../util/date-util';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent extends BaseUploadComponent implements OnInit {
  songUploadData: SongUploadData = this.initSongUploadData();
  isLoading = false;
  countryList: Country[];
  modelToTextMapper = artistModelToTextMapper;
  modelToImgSrcMapper = artistModelToImgSrcMapper;
  minDate = DateUtil.getMinDate();

  constructor(
    private songService: SongService,
    protected artistService: ArtistService,
    private countryService: CountryService,
    protected fb: FormBuilder,
    protected router: Router,
    private toastService: VgToastService
  ) {
    super(fb, router, artistService, null);
  }

  get artists(): FormArray {
    return this.songUploadData.formGroup.get('artists') as FormArray;
  }

  addArtist(): void {
    this.artists.push(this.createArtist());
  }

  removeArtist(index: number): void {
    this.artists.removeAt(index);
  }

  ngOnInit(): void {
    this.countryService.getCountryList(0).subscribe(next => {
      this.countryList = next.content;
    });
  }

  upload(): void {
    if (!this.songUploadData.isValid()) {
      return;
    }
    const songFormDate = this.songUploadData.setup();
    this.songUploadData.observable = this.songService.uploadSong(songFormDate);
  }

  uploadSuccess(song: Song): void {
    this.toastService.success({ text: 'Upload song successfully!' });
    setTimeout(() => {
      this.router.navigate(['song', 'detail'], { queryParams: { id: song.id } });
    }, 1500);
  }

  suggestArtist(value: string): void {
    this.isLoading = true;
    this.artistService
      .searchArtistByName(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(artists => (this.songUploadData.filteredSongArtists = artists));
  }

  setMetadata(event: Event, formGroup: FormGroup): void {
    const target = event.target as HTMLAudioElement;
    formGroup.get('duration').setValue(target.duration);
  }
}
