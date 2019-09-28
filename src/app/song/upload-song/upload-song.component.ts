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
  constructor(
    private audioUploadService: AudioUploadService,
    private fb: FormBuilder
  ) {}
  songUploadForm: FormGroup;
  file: any;

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
    // var formData = new FormData();
    var data = this.encode(JSON.stringify(this.songUploadForm.value));
    var audioUploadForm = new Blob([data], {
      type: 'application/json'
    });
    this.formData.append('audio', this.file);
    this.formData.append('audioUploadForm', audioUploadForm);
    console.log(this.songUploadForm.value);
    console.log(this.formData.get('audioUploadForm'));
    this.audioUploadService.uploadSong(this.formData).subscribe(
      result => {console.log(result); },
      error => {console.log(error); }
    );
  }

  encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
      out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
  }
}
