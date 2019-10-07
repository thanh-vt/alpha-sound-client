import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Artist} from '../../model/artist';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent implements OnInit {
  isAudioFileChosen = false;
  audioFileName = '';
  progress = 0;
  message: string;
  songUploadForm: FormGroup;
  options: Artist[] = [];
  filteredOptions: Observable<Artist[]>;
  formData = new FormData();
  file: any;
  constructor(
    private audioUploadService: AudioUploadService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.songUploadForm = this.fb.group({
      name: ['', Validators.required],
      artists: this.fb.array([this.createArtist()]),
      releaseDate: ['', Validators.required],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null]
    });
  }

  get artists(): FormArray {
    return this.songUploadForm.get('artists') as FormArray;
  }

  createArtist(): FormGroup {
    return this.fb.group({
      id: [null],
      name: '',
      birthDate: [null],
      avatarUrl: [null],
      biography: [null]
    });
  }

  addArtist(): void {
    // this.artists = this.songUploadForm.get('artists') as FormArray;
    this.artists.push(this.createArtist());
  }

  removeArtist(index: number) {
    // this.artists = this.songUploadForm.get('artists') as FormArray;
    this.artists.removeAt(index);
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isAudioFileChosen = true;
      this.audioFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress) {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        progress = Math.round(event.loaded / event.total * 100);
        console.log(`Uploaded! ${progress}%`);
        break;
      case HttpEventType.Response:
        console.log('User successfully created!', event.body);
        setTimeout(() => {
          progress = 0;
        }, 1500);
    }
  }

  upload() {
    this.formData.append('song', new Blob([JSON.stringify(this.songUploadForm.value)], {type: 'application/json'}));
    this.formData.append('audio', this.file);
    this.audioUploadService.uploadSong(this.formData).subscribe(
      (event: HttpEvent<any>) => {
        this.message = 'Song uploaded successfully!';
        this.displayProgress(event, this.progress);
      }, error => {
        this.message = 'Failed to upload song. Cause: ' + error.songsMessage;
      }
    );
  }

  loadArtistList() {

  }

  displayFn(artist?: Artist): string | undefined {
    return artist ? artist.name : undefined;
  }

  private _filter(name: string): Artist[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
