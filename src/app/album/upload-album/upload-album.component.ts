import {AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AudioUploadService} from '../../service/audio-upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Artist} from '../../model/artist';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ArtistService} from '../../service/artist.service';
import {isBoolean} from 'util';

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
  isAlbumLoading: boolean;
  isImageFileChosen: boolean;
  imageFileName: string;
  filteredAlbumArtists: Artist[];

  songsForm: FormGroup[] = new Array(1);
  songsFormData: FormData[] = [];
  songsMessage: string[] = [];
  songsProgress: number[] = [];
  audioFiles: any[] = [];
  isSongLoading: [[boolean]] = [[false]];
  isAudioFileChosen: boolean[] = [];
  audioFileNames: string[] = [];
  filteredSongArtist: [Artist[]];

  constructor(private formBuilder: FormBuilder, private audioUploadService: AudioUploadService, private renderer: Renderer2, private artistService: ArtistService) { }

  static createArtist(): FormControl {
    return new FormControl();
  }

  getAlbumArtists(): FormArray {
    return this.albumForm.get('artists') as FormArray;
  }

  getSongArtists(i): FormArray {
    return this.songsForm[i].get('artists') as FormArray;
  }

  addAlbumArtist(): void {
    this.getAlbumArtists().push(UploadAlbumComponent.createArtist());
  }

  removeAlbumArtist(index: number): void {
    this.getAlbumArtists().removeAt(index);
  }

  addSongArtist(i: number) {
    this.isSongLoading[i].push(false);
    this.getSongArtists(i).push(UploadAlbumComponent.createArtist());
  }

  removeSongArtist(i: number, index: number): void {
    this.isSongLoading[i].splice(index, 1);
    this.getSongArtists(i).removeAt(index);
  }

  displayFn(artist: Artist) {
    if (artist) { return artist.name; }
  }

  ngAfterViewChecked() {
    if (this.card1 && this.card2) {
      var height = `${this.card1.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.card2.nativeElement, 'height', height);
    }
  }

  ngOnInit() {
    this.albumForm = this.formBuilder.group({
      name: [''],
      artists: this.formBuilder.array([this.formBuilder.control(null)]),
      releaseDate: [''],
      genres: [''],
      tags: [''],
      country: [''],
      theme: ['']
    });
    this.songsForm[0] = this.formBuilder.group({
      name: [''],
      artists: this.formBuilder.array([this.formBuilder.control(null)]),
      releaseDate: [''],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null]
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

    for (let i = 0; i < this.getAlbumArtists().length; i++) {
      this.getAlbumArtists().controls[i].valueChanges
        .pipe(
          debounceTime(300),
          tap(() => this.isAlbumLoading = true),
          switchMap(value => this.artistService.searchArtist(value)
            .pipe(
              finalize(() => this.isAlbumLoading = false),
            )
          )
        ).subscribe(artists => this.filteredAlbumArtists = artists);
    }

    for (let j = 0; j < this.songsForm.length; j++) {
      for (let k = 0; k < this.getSongArtists(j).length; k++) {
        this.getAlbumArtists().controls[k].valueChanges
          .pipe(
            debounceTime(300),
            tap(() => this.isSongLoading[j][k] = true),
            switchMap(value => this.artistService.searchArtist(value)
              .pipe(
                finalize(() => this.isSongLoading[j][k] = false),
              )
            )
          ).subscribe(artists => this.filteredSongArtist[j] = artists);
      }
    }

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
        artists: this.formBuilder.array([this.formBuilder.control(null)]),
        releaseDate: new FormControl(''),
        album: new FormControl(''),
        genres: new FormControl(null),
        tags: new FormControl(null),
        country: new FormControl(null),
        theme: new FormControl(null)
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
    if (this.numbersOfSongForms > 1) {
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
    this.albumFormData.append('album', new Blob([JSON.stringify(this.albumForm.value)], {type: 'application/json'}));
    this.albumFormData.append('cover', this.imageFile);
    this.audioUploadService.uploadAlbum(this.albumFormData).subscribe(
      (createAlbumEvent: HttpEvent<any>) => {
        this.displayProgress(createAlbumEvent, this.albumProgress);
        this.albumMessage = 'Album created successfully!';
        for (let i = 0; i < this.numbersOfSongForms; i++) {
          this.songsFormData[i].append('song', new Blob([JSON.stringify(this.songsForm[i].value)], {type: 'application/json'}));
          this.songsFormData[i].append('audio', this.audioFiles[i]);
          this.songsFormData[i].append('albumId', String(createAlbumEvent));
          this.audioUploadService.uploadSong(this.songsFormData[i]).subscribe(
            (uploadSongEvent: HttpEvent<any>) => {
              this.displayProgress(uploadSongEvent, this.songsProgress[i]);
              this.songsMessage[i] = 'Song uploaded successfully!';
            }, uploadSongError => {
              this.songsMessage[i] = 'Failed to upload song! Cause: ' + uploadSongError.message;
            }
          );
        }
      }, createAlbumError => {
        this.albumMessage = 'Failed to create album! Cause: ' + createAlbumError.message;
      }
    );
  }

}
