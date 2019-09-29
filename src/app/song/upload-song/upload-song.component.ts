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
        console.log(result);
        this.formData.append('songId', String(result));
        this.formData.append('audio', this.file);
        this.audioUploadService.uploadSong(this.formData).subscribe(
          result1 => {
            console.log(result1);
          },
          error1 => {
            this.message = error1.message;
            console.log(error1); }
        );
      }, error => {
        this.message = error.message;
        console.log(error);
      }
    );
  }
}
