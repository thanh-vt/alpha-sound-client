import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent implements OnInit {
  formData = new FormData();
  progress = 0;
  message: string;
  constructor(
    private audioUploadService: AudioUploadService,
    private fb: FormBuilder
  ) {}
  songUploadForm: FormGroup;
  file: File;

  ngOnInit() {
    this.songUploadForm = this.fb.group({
      name: ['', Validators.required],
      artists: ['', Validators.required],
      releaseDate: [''],
      album: [null],
      genres: [''],
      tags: [''],
      mood: [''],
      activity: ['']
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
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
    this.audioUploadService.createSong(this.songUploadForm.value).subscribe(
      result => {
        this.message = 'Song created successfully!';
        this.formData.append('songId', String(result));
        this.formData.append('audio', this.file);
        this.audioUploadService.uploadSong(this.formData).subscribe(
          (event: HttpEvent<any>)  => {
            this.displayProgress(event, this.progress);
            // switch (event.type) {
            //   case HttpEventType.Sent:
            //     console.log('Request has been made!');
            //     break;
            //   case HttpEventType.ResponseHeader:
            //     console.log('Response header has been received!');
            //     break;
            //   case HttpEventType.UploadProgress:
            //     this.progress = Math.round(event.loaded / event.total * 100);
            //     console.log(`Uploaded! ${this.progress}%`);
            //     break;
            //   case HttpEventType.Response:
            //     console.log('User successfully created!', event.body);
            //     setTimeout(() => {
            //       this.progress = 0;
            //     }, 1500);
            // }
            this.message = 'Song uploaded successfully!';
          },
          error1 => {
            this.message = 'Failed to upload song. Cause: ' + error1.songsMessage;
          }
        );
      }, error => {
        this.message = 'Failed to create song. Cause: ' + error.songsMessage;
      }
    );
  }
}
