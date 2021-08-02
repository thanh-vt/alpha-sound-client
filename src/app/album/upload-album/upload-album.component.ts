import { AfterViewChecked, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AudioUploadService } from '../../service/audio-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Artist } from '../../model/artist';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { ArtistService } from '../../service/artist.service';
import { Subscription } from 'rxjs';
import { Progress } from '../../model/progress';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('card1') card1;
  @ViewChild('card2') card2;

  submitted: boolean;
  numbersOfSongForms = 0;

  albumForm: FormGroup;
  albumMessage: string;
  albumError = false;
  albumFormData: FormData;
  albumProgress: Progress;
  imageFile: any;
  isAlbumLoading: boolean;
  isImageFileChosen: boolean;
  imageFileName: string;
  filteredAlbumArtists: Artist[];

  songsForm: FormGroup[] = new Array(1);
  songsFormData: FormData[] = [];
  songsMessage: string[] = [];
  songError: boolean[] = [];
  songsProgress: Progress[] = [];
  audioFiles: any[] = [];
  isSongLoading: [[boolean]] = [[false]];
  isAudioFileChosen: boolean[] = [];
  audioFileNames: string[] = [];
  filteredSongArtist: [Artist[]] = [[]];

  subscription: Subscription = new Subscription();

  // eslint-disable-next-line max-len
  keyword = 'name';
  constructor(
    private formBuilder: FormBuilder,
    private audioUploadService: AudioUploadService,
    private renderer: Renderer2,
    private artistService: ArtistService
  ) {}

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
    if (artist) {
      return artist.name;
    }
  }

  ngAfterViewChecked() {
    if (this.card1 && this.card2) {
      const height = `${this.card1.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.card2.nativeElement, 'height', height);
    }
  }

  ngOnInit() {
    this.albumForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      artists: this.formBuilder.array([this.formBuilder.control(null, Validators.compose([Validators.required]))]),
      releaseDate: ['', Validators.compose([Validators.required])],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null]
    });
    this.songsForm[0] = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      artists: this.formBuilder.array([this.formBuilder.control(null, Validators.compose([Validators.required]))]),
      releaseDate: ['', Validators.compose([Validators.required])],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null],
      duration: [null]
    });

    this.albumMessage = '';
    this.albumProgress = { value: 0 };
    this.albumFormData = new FormData();
    this.isImageFileChosen = false;
    this.imageFileName = '';

    this.songsMessage[0] = '';
    this.songError[0] = false;
    this.songsProgress[0] = { value: 0 };
    this.songsFormData[0] = new FormData();
    this.audioFiles[0] = null;
    this.isAudioFileChosen[0] = false;
    this.audioFileNames[0] = '';
    this.numbersOfSongForms++;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
      this.isImageFileChosen = true;
      this.imageFileName = event.target.files[0].name.substr(0, 20);
    }
  }

  addForm() {
    if (this.numbersOfSongForms < 20) {
      this.songsForm.splice(
        this.numbersOfSongForms,
        1,
        new FormGroup({
          title: new FormControl('', Validators.compose([Validators.required])),
          artists: this.formBuilder.array([this.formBuilder.control(null, Validators.compose([Validators.required]))]),
          releaseDate: new FormControl('', Validators.compose([Validators.required])),
          album: new FormControl(''),
          genres: new FormControl(null),
          tags: new FormControl(null),
          country: new FormControl(null),
          theme: new FormControl(null),
          duration: new FormControl(null)
        })
      );

      this.songsFormData.splice(this.numbersOfSongForms, 1, new FormData());
      this.audioFiles.splice(this.numbersOfSongForms, 1, null);
      this.songsMessage.splice(this.numbersOfSongForms, 1, '');
      this.songError.push(false);
      this.songsProgress.splice(this.numbersOfSongForms, 1, { value: 0 });
      this.isAudioFileChosen.push(false);
      this.audioFileNames.push('');
      this.isSongLoading.push([false]);
      this.numbersOfSongForms++;
    }
  }

  selectAudio(event, i) {
    if (event.target.files.length > 0) {
      this.audioFiles.splice(i, 1, event.target.files[0]);
      this.isAudioFileChosen.splice(i, 1, true);
      this.audioFileNames.splice(i, 1, event.target.files[0].name.substr(0, 20));
      new Audio(URL.createObjectURL(this.audioFiles[i])).onloadedmetadata = (e: any) => {
        this.songsForm[i].get('duration').setValue(e.currentTarget.duration);
      };
    }
  }

  removeForm(i) {
    if (this.numbersOfSongForms > 1) {
      this.songsForm.splice(i, 1);
      this.songsFormData.splice(i, 1);
      this.audioFiles.splice(i, 1);
      this.songsMessage.splice(i, 1);
      this.songError.splice(i, 1);
      this.songsProgress.splice(i, 1);
      this.isAudioFileChosen.splice(i, 1);
      this.audioFileNames.splice(i, 1);
      this.numbersOfSongForms--;
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
        progress = Math.round((event.loaded / event.total) * 100);
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
    this.albumFormData.append('album', new Blob([JSON.stringify(this.albumForm.value)], { type: 'application/json' }));
    this.albumFormData.append('cover', this.imageFile);
    this.submitted = true;
    let isSongFormsValid = true;
    for (const songForm of this.songsForm) {
      if (!songForm.valid) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumForm.valid && isSongFormsValid) {
      this.audioUploadService.uploadAlbum(this.albumFormData).subscribe(
        createAlbumResult => {
          this.albumError = false;
          this.albumMessage = 'Album created successfully.';
          for (let i = 0; i < this.numbersOfSongForms; i++) {
            this.songsFormData[i].append('song', new Blob([JSON.stringify(this.songsForm[i].value)], { type: 'application/json' }));
            this.songsFormData[i].append('audio', this.audioFiles[i]);
            this.audioUploadService.uploadSong(this.songsFormData[i], createAlbumResult).subscribe(
              (uploadSongEvent: HttpEvent<any>) => {
                this.displayProgress(uploadSongEvent, this.songsProgress[i]);
                this.songError[i] = false;
                this.songsMessage[i] = 'Song uploaded successfully.';
              },
              uploadSongError => {
                this.songError[i] = true;
                this.songsMessage[i] = 'Failed to upload song.';
                console.log(uploadSongError.message);
              }
            );
          }
        },
        createAlbumError => {
          this.albumMessage = 'Failed to create album.';
          console.log(createAlbumError.message);
        }
      );
    }
  }

  suggestAlbumArtist(i) {
    this.subscription.add(
      (this.subscription = this.getAlbumArtists()
        .controls[i].valueChanges.pipe(
          debounceTime(300),
          tap(() => (this.isAlbumLoading = true)),
          switchMap(value =>
            this.artistService.searchArtist(typeof value === 'string' ? value : '').pipe(finalize(() => (this.isAlbumLoading = false)))
          )
        )
        .subscribe(artists => (this.filteredAlbumArtists = artists)))
    );
  }

  suggestSongArtist(j, k) {
    this.subscription.add(
      this.getSongArtists(j)
        .controls[k].valueChanges.pipe(
          debounceTime(300),
          tap(() => {
            this.isSongLoading[j][k] = true;
          }),
          switchMap(value =>
            this.artistService.searchArtist(typeof value === 'string' ? value : '').pipe(finalize(() => (this.isSongLoading[j][k] = false)))
          )
        )
        .subscribe(artists => (this.filteredSongArtist[j] = artists))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
