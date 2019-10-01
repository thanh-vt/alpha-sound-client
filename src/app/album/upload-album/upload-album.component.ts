import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent implements OnInit {
  // numbersOfSongUploadFrom = 1;

  formArray = [];

  constructor() { }

  ngOnInit() {
    const songUploadForm1 = new FormGroup({
      name: new FormControl(''),
      artists: new FormControl(''),
      releaseDate: new FormControl(''),
      album: new FormControl(''),
      genres: new FormControl(''),
      tags: new FormControl(''),
      mood: new FormControl(''),
      activity: new FormControl('')
    });
    this.formArray.push(songUploadForm1);
  }

  addForm() {
    this.formArray.push(new FormGroup({
      name: new FormControl(''),
      artists: new FormControl(''),
      releaseDate: new FormControl(''),
      album: new FormControl(''),
      genres: new FormControl(''),
      tags: new FormControl(''),
      mood: new FormControl(''),
      activity: new FormControl('')
    }));
  }

}
