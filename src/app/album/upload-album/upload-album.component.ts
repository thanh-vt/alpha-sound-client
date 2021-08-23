import { AfterViewChecked, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AudioUploadService } from '../../service/audio-upload.service';
import { ArtistService } from '../../service/artist.service';
import { SongUploadData } from 'src/app/model/song-upload-data';
import { AlbumUploadData } from '../../model/album-upload-data';
import { VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.scss']
})
export class UploadAlbumComponent implements OnInit, AfterViewChecked {
  @ViewChild('card1') card1;
  @ViewChild('card2') card2;
  keyword = 'name';
  albumUploadData: AlbumUploadData;
  songUploadDataList: SongUploadData[] = [];

  constructor(
    private fb: FormBuilder,
    private audioUploadService: AudioUploadService,
    private renderer: Renderer2,
    private artistService: ArtistService,
    private toastService: VgToastService
  ) {}

  createArtist(): FormControl {
    return this.fb.control(null, { validators: [Validators.required] });
  }

  getAlbumArtists(): FormArray {
    return this.albumUploadData.formGroup.get('artists') as FormArray;
  }

  getSongArtists(i: number): FormArray {
    // return this.songsForm[i].get('artists') as FormArray;
    return this.songUploadDataList[i].formGroup.get('artists') as FormArray;
  }

  addAlbumArtist(): void {
    this.getAlbumArtists().push(this.createArtist());
  }

  removeAlbumArtist(index: number): void {
    this.getAlbumArtists().removeAt(index);
  }

  addSongArtist(i: number): void {
    this.getSongArtists(i).push(this.createArtist());
  }

  removeSongArtist(i: number, index: number): void {
    this.getSongArtists(i).removeAt(index);
  }

  ngAfterViewChecked(): void {
    if (this.card1 && this.card2) {
      const height = `${this.card1.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.card2.nativeElement, 'height', height);
    }
  }

  ngOnInit(): void {
    this.albumUploadData = new AlbumUploadData(
      this.fb.group({
        title: ['', Validators.compose([Validators.required])],
        artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
        releaseDate: ['', Validators.compose([Validators.required])],
        genres: [null],
        tags: [null],
        country: [null],
        theme: [null]
      }),
      []
    );
    this.songUploadDataList.push(
      new SongUploadData(
        this.fb.group({
          title: ['', Validators.compose([Validators.required])],
          artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
          releaseDate: ['', Validators.compose([Validators.required])],
          album: [null],
          genres: [null],
          tags: [null],
          country: [null],
          theme: [null],
          duration: [null]
        }),
        []
      )
    );
  }

  selectImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files.length > 0) {
      this.albumUploadData.imageFile = target.files[0];
    }
  }

  addForm(): void {
    if (this.songUploadDataList.length < 20) {
      this.songUploadDataList.push(
        new SongUploadData(
          this.fb.group({
            title: ['', Validators.compose([Validators.required])],
            artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
            releaseDate: ['', Validators.compose([Validators.required])],
            album: [''],
            genres: [null],
            tags: [null],
            country: [null],
            theme: [null],
            duration: [null]
          }),
          []
        )
      );
    }
  }

  selectAudio(event: Event, i: number): void {
    const target = event.target as HTMLInputElement;
    if (target.files.length > 0) {
      this.songUploadDataList[i].audioFile = target.files[0];
      new Audio(URL.createObjectURL(this.songUploadDataList[i].audioFile)).onloadedmetadata = (loadedEvent: Event) => {
        const target = loadedEvent.currentTarget as HTMLAudioElement;
        this.songUploadDataList[i].formGroup.get('duration').setValue(target.duration);
      };
    }
  }

  removeForm(i: number): void {
    if (this.songUploadDataList.length > 1) {
      this.songUploadDataList.splice(i, 1);
    }
  }

  onSubmit(): void {
    let isSongFormsValid = true;
    for (const songUploadData of this.songUploadDataList) {
      if (!songUploadData.isValid()) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumUploadData.isValid() && isSongFormsValid) {
      const albumFormData: FormData = this.albumUploadData.setup();
      this.audioUploadService.uploadAlbum(albumFormData).subscribe(createAlbumResult => {
        this.toastService.success({ text: 'Album created successfully' });
        for (const songUploadData of this.songUploadDataList) {
          const songFormData: FormData = songUploadData.setup();
          songUploadData.observable = this.audioUploadService.uploadSong(songFormData, createAlbumResult);
        }
      });
    }
  }

  suggestAlbumArtist(value: string): void {
    this.artistService.searchArtist(value).subscribe(artists => {
      this.albumUploadData.filteredAlbumArtists = artists;
    });
  }

  suggestSongArtist(value: string, songIndex: number): void {
    this.artistService.searchArtist(value).subscribe(artists => {
      this.songUploadDataList[songIndex].filteredSongArtists = artists;
    });
  }
}
