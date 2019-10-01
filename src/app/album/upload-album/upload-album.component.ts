import {AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent implements OnInit, AfterViewChecked {
  @ViewChild('card1', {static: false}) card1;
  @ViewChild('card2', {static: false}) card2;

  numbersOfSongForms = 0;

  albumForm: FormGroup;
  albumMessage: string;
  albumFormData = new FormData();
  albumProgress = 0;
  imageFile: any;
  isImageFileChosen: boolean;
  imageFileName: string;

  songsForm: FormGroup[] = new Array(1);
  songsFormData: FormData[] = [];
  songsMessage: string[] = [];
  songsProgress: number[] = [];
  audioFiles: any[] = [];
  isAudioFileChosen: boolean[] = [];
  audioFileNames: string[] = [];

  constructor(private formBuilder: FormBuilder, private audioUploadService: AudioUploadService, private renderer: Renderer2) { }

  ngAfterViewChecked() {
    if (this.card1 && this.card2) {
      var height = `${this.card1.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.card2.nativeElement, 'height', height);
    }
  }

  ngOnInit() {
    this.albumForm = this.formBuilder.group({
      name: [''],
      artists: [''],
      releaseDate: [''],
      genres: [''],
      tags: [''],
      mood: [''],
      activity: ['']
    });
    this.songsForm[0] = this.formBuilder.group({
      name: [''],
      artists: [''],
      releaseDate: [''],
      album: [null],
      genres: [''],
      tags: [''],
      mood: [''],
      activity: ['']
    });

    this.isImageFileChosen = false;
    this.imageFileName = '';

    this.songsMessage[0] = '';
    this.songsProgress[0] = 0;
    this.songsFormData[0] = new FormData();
    this.audioFiles[0] = null;
    this.isAudioFileChosen[0] = false;
    this.audioFileNames[0] = '';
    this.numbersOfSongForms++;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  addForm() {
    if (this.numbersOfSongForms < 20) {
      this.songsForm.splice(this.numbersOfSongForms, 1, new FormGroup({
        name: new FormControl(''),
        artists: new FormControl(''),
        releaseDate: new FormControl(''),
        album: new FormControl(''),
        genres: new FormControl(''),
        tags: new FormControl(''),
        mood: new FormControl(''),
        activity: new FormControl('')
      }));
      this.songsFormData.splice(this.numbersOfSongForms, 1, new FormData());
      this.audioFiles.splice(this.numbersOfSongForms, 1, null);
      this.songsMessage.splice(this.numbersOfSongForms, 1, '');
      this.songsProgress.splice(this.numbersOfSongForms, 1, 0);
      this.isAudioFileChosen.push(false);
      this.audioFileNames.push('');
      this.numbersOfSongForms++;
    }
    console.log(this.songsFormData);
    console.log(this.audioFiles);
    console.log(this.isAudioFileChosen);
    console.log(this.audioFileNames);
  }

  selectAudio(event, i) {
    if (event.target.files.length > 0) {
      this.audioFiles.splice(i, 1, event.target.files[0]);
      this.isAudioFileChosen.splice(i, 1, true);
      this.audioFileNames.splice(i, 1, event.target.files[0].name.substr(0, 20));
      console.log(this.isAudioFileChosen);
      console.log(this.audioFileNames);
    }
  }

  removeForm(i) {
    if (this.numbersOfSongForms > 0) {
      this.songsForm.splice(i, 1);
      this.songsFormData.splice(i, 1);
      this.audioFiles.splice(i, 1);
      this.songsMessage.splice(i, 1);
      this.songsProgress.splice(i, 1);
      this.isAudioFileChosen.splice(i, 1);
      this.audioFileNames.splice(i, 1);
      this.numbersOfSongForms--;
      console.log(this.songsFormData);
      console.log(this.audioFiles);
      console.log(this.isAudioFileChosen);
      console.log(this.audioFileNames);
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
        console.log('Successfully created!', event.body);
        setTimeout(() => {
          progress = 0;
        }, 1500);
    }
  }

  onSubmit() {
    this.audioUploadService.createAlbum(this.albumForm.value).subscribe(
      createAlbumResult => {
        this.albumMessage = 'Album created successfully!';
        this.albumFormData.append('albumId', String(createAlbumResult));
        this.albumFormData.append('cover', this.imageFile);
        this.audioUploadService.uploadAlbum(this.albumFormData).subscribe(
          (uploadAlbumCoverEvent: HttpEvent<any>) => {
            this.displayProgress(uploadAlbumCoverEvent, this.albumProgress);
            this.albumMessage = 'Album\'s cover uploaded successfully!';
          }, uploadAlbumCoverError => {
            this.albumMessage = 'Failed to upload album\'s cover! Cause: ' + uploadAlbumCoverError.message;
          }
        );
        for (let i = 0; i < this.numbersOfSongForms; i++) {
          this.audioUploadService.createSong(this.songsForm[i].value).subscribe(
            createSongResult => {
              this.songsMessage[i] = 'Song created successfully!';
              this.songsFormData[i].append('songId', String(createSongResult));
              this.songsFormData[i].append('albumId', String(createAlbumResult));
              this.songsFormData[i].append('audio', this.audioFiles[i]);
              this.audioUploadService.uploadSong(this.songsFormData[i]).subscribe(
                (uploadSongEvent: HttpEvent<any>) => {
                  this.displayProgress(uploadSongEvent, this.songsProgress[i]);
                  this.songsMessage[i] = 'Song uploaded successfully!';
                }, uploadSongError => {
                  this.songsMessage[i] = 'Failed to upload song! Cause: ' + uploadSongError.message;
                }
              );
            }, uploadSongResult => {
              this.songsMessage[i] = 'Failed to create song! Cause: ' + uploadSongResult.message;
            }
          );
        }
      }
    );
  }

}
