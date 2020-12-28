import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Artist} from '../../model/artist';
import {ArtistService} from '../../service/artist.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Progress} from '../../model/progress';
import {DatePipe} from '@angular/common';
import {ViewEncapsulation} from '@angular/core';
import {CountryService} from '../../service/country.service';
import {Country} from '../../model/country';
import {TagService} from '../../service/tag.service';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadSongComponent implements OnInit, OnDestroy {

  constructor(private audioUploadService: AudioUploadService, private artistService: ArtistService,
              private countryService: CountryService, private fb: FormBuilder,
              private tagService: TagService) {
  }

  get artists(): FormArray {
    return this.songUploadForm.get('artists') as FormArray;
  }

  submitted: boolean;

  isAudioFileChosen = false;
  audioFileName = '';
  progress: Progress = {value: 0};
  message: string;
  songUploadForm: FormGroup;

  formData = new FormData();
  file: any;
  isLoading = false;
  filteredArtists: Artist[];
  countryList: Country[];
  error = false;

  subscription: Subscription = new Subscription();

  static createArtist(): FormControl {
    return new FormControl('', Validators.compose([Validators.required]));
  }

  static navigate() {
    // this.router.navigate(['/uploaded/list']);
    location.replace('/uploaded/list');
  }

  addArtist(): void {
    this.artists.push(UploadSongComponent.createArtist());
  }

  removeArtist(index: number) {
    this.artists.removeAt(index);
  }

  displayFn(artist: Artist) {
    if (artist) {
      return artist.name;
    }
  }

  ngOnInit() {
    this.songUploadForm = this.fb.group({
      title: ['', Validators.required],
      artists: this.fb.array([UploadSongComponent.createArtist()]),
      releaseDate: ['', Validators.compose([Validators.required])],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null],
      duration: [null]
    });
    new DatePipe('en').transform(this.songUploadForm.value.releaseDate, 'dd/MM/yyyy');
    this.subscription.add(this.countryService.getCountryList(0)
      .subscribe(
        next => {
          this.countryList = next.content;
        }, error => {
          console.log(error);
        }
      ));

  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0] as File;
      this.isAudioFileChosen = true;
      this.audioFileName = event.target.files[0].name;

      new Audio(URL.createObjectURL(this.file)).onloadedmetadata = (e: any) => {
        this.songUploadForm.get('duration').setValue(e.currentTarget.duration);
      };
    }
  }

  displayProgress(event, progress: Progress): boolean {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        progress.value = Math.round(event.loaded / event.total * 100);
        console.log(`Uploaded! ${progress.value}%`);
        break;
      case HttpEventType.Response:
        console.log('Song successfully created!', event.body);
        const complete = setTimeout(() => {
          progress.value = 0;
          const navigation = setInterval(() => {
            UploadSongComponent.navigate();
            clearTimeout(navigation);
            clearTimeout(complete);
          }, 2000);
        }, 500);
        return true;
    }
  }
  upload() {
    this.formData.append('song', new Blob([JSON.stringify(this.songUploadForm.value)], {type: 'application/json'}));
    this.formData.append('audio', this.file);
    this.submitted = true;
    console.log(this.songUploadForm);
    if (this.songUploadForm.valid) {
      this.subscription.add(this.audioUploadService.uploadSong(this.formData).subscribe(
        (event: HttpEvent<any>) => {
          if (this.displayProgress(event, this.progress)) {
            this.message = 'Song uploaded successfully.';
          }
        }, error => {
          this.progress.value = 0;
          if (error.status === 400) {
            this.message = 'Failed to upload song. Cause: Artist(s) not found in database.';
          } else {
            this.message = 'Failed to upload song.';
            console.log(error.message);
          }
        }
      ));
    }
  }

  suggestArtist(i) {
    this.subscription.add(this.artists.controls[i].valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.artistService.searchArtist((typeof value === 'string') ? value : '')
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(artists => this.filteredArtists = artists));
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
