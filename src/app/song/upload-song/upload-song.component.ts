import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AudioUploadService } from '../../service/audio-upload.service';
import { ArtistService } from '../../service/artist.service';
import { finalize } from 'rxjs/operators';
import { CountryService } from '../../service/country.service';
import { Country } from '../../model/country';
import { VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadSongComponent implements OnInit {
  songUploadData: SongUploadData;
  isLoading = false;
  countryList: Country[];

  constructor(
    private audioUploadService: AudioUploadService,
    private artistService: ArtistService,
    private countryService: CountryService,
    private fb: FormBuilder,
    private toastService: VgToastService
  ) {}

  get artists(): FormArray {
    return this.songUploadData.formGroup.get('artists') as FormArray;
  }

  createArtist(): FormControl {
    return new FormControl('', Validators.compose([Validators.required]));
  }

  addArtist(): void {
    this.artists.push(this.createArtist());
  }

  removeArtist(index: number): void {
    this.artists.removeAt(index);
  }

  ngOnInit(): void {
    this.songUploadData = new SongUploadData(
      this.fb.group({
        title: ['', [Validators.required]],
        artists: this.fb.array([this.createArtist()]),
        releaseDate: [new Date(), Validators.compose([Validators.required])],
        album: [null],
        genres: [null],
        tags: [null],
        country: [null],
        theme: [null],
        duration: [null]
      }),
      []
    );
    this.countryService.getCountryList(0).subscribe(next => {
      this.countryList = next.content;
    });
  }

  selectFile(event: Event): void {
    const eventTarget: HTMLInputElement = event.target as HTMLInputElement;
    if (eventTarget.files.length > 0) {
      this.songUploadData.audioFile = eventTarget.files[0];
      new Audio(URL.createObjectURL(this.songUploadData.audioFile)).onloadedmetadata = (loadedEvent: Event) => {
        const target = loadedEvent.currentTarget as HTMLAudioElement;
        this.songUploadData.formGroup.get('duration').setValue(target.duration);
      };
    }
  }

  upload(): void {
    if (!this.songUploadData.isValid()) {
      return;
    }
    const songFormDate = this.songUploadData.setup();
    this.songUploadData.observable = this.audioUploadService.uploadSong(songFormDate);
  }

  uploadSuccess(): void {
    this.toastService.success({ text: 'Upload song successfully!' });
    setTimeout(() => {
      location.replace('/uploaded/list');
    }, 3000);
  }

  suggestArtist(value: string): void {
    this.isLoading = true;
    this.artistService
      .searchArtist(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(artists => (this.songUploadData.filteredSongArtists = artists));
  }
}
