import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Artist} from '../../model/artist';
import {ArtistService} from '../../service/artist.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Progress} from '../../model/progress';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent implements OnInit {

  constructor(private audioUploadService: AudioUploadService, private artistService: ArtistService, private fb: FormBuilder) { }

  isAudioFileChosen = false;
  audioFileName = '';
  progress: Progress = {value: 0};
  message: string;
  songUploadForm: FormGroup;

  formData = new FormData();
  file: any;
  isLoading = false;
  filteredArtists: Artist[];

  subscription: Subscription = new Subscription();

  static createArtist(): FormControl {
    return new FormControl();
  }

  get artists(): FormArray {
    return this.songUploadForm.get('artists') as FormArray;
  }

  addArtist(): void {
    this.artists.push(UploadSongComponent.createArtist());
    console.log(this.songUploadForm.value);
  }

  removeArtist(index: number) {
    this.artists.removeAt(index);
  }

  displayFn(artist: Artist) {
    if (artist) { return artist.name; }
  }

  ngOnInit() {
    this.songUploadForm = this.fb.group({
      name: ['', Validators.required],
      artists: this.fb.array([UploadSongComponent.createArtist()]),
      releaseDate: ['', Validators.required],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null]
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isAudioFileChosen = true;
      this.audioFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress: Progress) {
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
        setTimeout(() => {
          progress.value = 0;
        }, 1500);
    }
  }

  upload() {
    // for (let i = 0; i < this.artists.length; i++) {
    //   console.suggestSongArtist(this.artists.value[i]);
    //   console.suggestSongArtist(typeof this.artists.value[i]);
    //   const artistName = this.artists.value[i];
    //   if (typeof this.artists.value[i] === 'string') {
    //     this.artists.controls[i].setValue({
    //       id: null,
    //       name: artistName,
    //       birthDate: null,
    //       avatarUrl: null,
    //       biography: null
    //     });
    //   }
    // }
    this.formData.append('song', new Blob([JSON.stringify(this.songUploadForm.value)], {type: 'application/json'}));
    this.formData.append('audio', this.file);
    console.log(this.songUploadForm.value);
    this.audioUploadService.uploadSong(this.formData).subscribe(
      (event: HttpEvent<any>) => {
        this.message = 'Song uploaded successfully!';
        this.displayProgress(event, this.progress);
      }, error => {
        this.progress.value = 0;
        if (error.status === 400) {
          this.message = 'Failed to upload song. Cause: Artist(s) not found in database.';
        } else {
          this.message = 'Failed to upload song. Cause: ' + error.message ;
        }
      }
    );
  }
  suggestArtist(i) {
    this.subscription.unsubscribe();
    this.subscription = this.artists.controls[i].valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.artistService.searchArtist(value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(artists => this.filteredArtists = artists);
  }
}
