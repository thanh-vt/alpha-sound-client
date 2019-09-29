import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent implements OnInit {
  formData = new FormData();
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

  upload() {
    this.audioUploadService.createSong(this.songUploadForm.value).subscribe(
      result => {
        this.message = 'Song created successfully!';
        this.formData.append('songId', String(result));
        this.formData.append('audio', this.file);
        this.audioUploadService.uploadSong(this.formData).subscribe(
          result1 => {
            this.message = 'Song uploaded successfully!';
          },
          error1 => {
            this.message = 'Failed to upload song. Cause: ' + error1.message;
            }
        );
      }, error => {
        this.message = 'Failed to create song. Cause: ' + error.message;
      }
    );
  }
}
