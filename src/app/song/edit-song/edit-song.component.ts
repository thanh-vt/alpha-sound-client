import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Song} from '../../model/song';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SongService} from '../../service/song.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Artist} from '../../model/artist';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ArtistService} from '../../service/artist.service';
import {Subscription} from 'rxjs';
import {Progress} from '../../model/progress';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit, OnDestroy {
  @Input() song: Song;
  songId: number;
  songUpdateForm: FormGroup;
  message: string;
  formData = new FormData();
  filteredArtists: Artist[];
  isLoading = false;
  isAudioFileChosen = false;
  audioFileName = '';
  progress: Progress = {value: 0};
  file: any;
  error = false;
  subscription: Subscription = new Subscription();

  static createArtist(): FormControl {
    return new FormControl();
  }

  get artists(): FormArray {
    return this.songUpdateForm.get('artists') as FormArray;
  }

  addArtist(): void {
    this.artists.push(EditSongComponent.createArtist());
  }

  removeArtist(index: number) {
    this.artists.removeAt(index);
  }

  displayFn(artist: Artist) {
    if (artist) {
      return artist.name;
    }
  }

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private songService: SongService,
              private fb: FormBuilder, private artistService: ArtistService) {
  }

  ngOnInit() {
    this.songUpdateForm = this.fb.group({
      title: ['', Validators.required],
      artists: this.fb.array([EditSongComponent.createArtist()]),
      releaseDate: [''],
      album: [null],
      genres: [null],
      tags: [null],
      country: [null],
      theme: [null]
    });
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.songId = params.id;
        this.songService.songDetail(this.songId).subscribe(
          result => {
            this.song = result;
            this.songUpdateForm = this.fb.group({
              title: [this.song.title, Validators.required],
              artists: this.fb.array([EditSongComponent.createArtist()]),
              releaseDate: [this.song.releaseDate],
              album: [null],
              genres: [null],
              tags: [null],
              country: [null],
              theme: [null]
            });
            this.songUpdateForm.get('artists').setValue(result.artists);
            for (let i = 0; i < this.artists.length; i++) {
              this.artists.controls[i].valueChanges
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
          }, error => {
            console.log(error);
          }
        );
      }
    ));
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isAudioFileChosen = true;
      this.audioFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress: Progress): boolean {
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
        const complete = setTimeout(() => {
          progress.value = 0;
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
            clearTimeout(complete);
          }, 2000);
        }, 500);
        return true;
    }
  }

  onSubmit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.songId = params.id;
        this.subscription.add(
          this.formData.append('song', new Blob([JSON.stringify(this.songUpdateForm.value)], {type: 'application/json'})));
        this.formData.append('audio', this.file);
        this.songService.updateSong(this.formData, this.songId).subscribe(
          (event: HttpEvent<any>) => {
            if (this.displayProgress(event, this.progress)) {
              this.message = 'Song updated successfully!';
            }
          }, error => {
            console.log(error);
            this.message = 'Failed to upload song. Cause: Artist(s) not found in database.';
          }
        );
      }
    ));
  }

  suggestArtist(i) {
    this.subscription.add(this.artists.controls[i].valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.artistService.searchArtist((typeof value === 'string') ? value : '')
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(artists => this.filteredArtists = artists));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigate() {
    location.replace('/uploaded');
  }
}
