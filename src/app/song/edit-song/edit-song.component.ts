import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SongService } from '../../service/song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../service/artist.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { artistModelToImgSrcMapper, artistModelToTextMapper } from '../../util/mapper.util';
import { DateUtil } from '../../util/date-util';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit {
  songId: number;
  songUploadData: SongUploadData;
  modelToTextMapper = artistModelToTextMapper;
  modelToImgSrcMapper = artistModelToImgSrcMapper;
  subscription: Subscription = new Subscription();
  minDate = DateUtil.getMinDate();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService,
    private fb: FormBuilder,
    private artistService: ArtistService,
    private toastService: VgToastService,
    private loaderServer: VgLoaderService
  ) {}

  createArtist(): FormControl {
    return this.fb.control(null);
  }

  get artists(): FormArray {
    return this.songUploadData.formGroup.get('artists') as FormArray;
  }

  addArtist(): void {
    this.artists.push(this.createArtist());
  }

  removeArtist(index: number): void {
    this.artists.removeAt(index);
  }

  ngOnInit(): void {
    this.songUploadData = new SongUploadData(
      this.fb.group({
        title: ['', Validators.required],
        artists: this.fb.array([]),
        releaseDate: [null],
        album: [null],
        genres: [null],
        tags: [null],
        country: [null],
        theme: [null],
        url: [null]
      })
    );
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.songId = params.id;
        this.loaderServer.loading(true);
        this.songService
          .songDetail(this.songId)
          .pipe(
            finalize(() => {
              this.loaderServer.loading(false);
            })
          )
          .subscribe(result => {
            this.songUploadData.formGroup.patchValue({
              title: result.title,
              releaseDate: result.releaseDate,
              url: result.url
            });
            const artistFormArr = this.songUploadData.formGroup.get('artists') as FormArray;
            artistFormArr.clear();
            result.artists.forEach(artist => {
              const artistForm = this.fb.control({
                id: artist.id,
                name: artist.name
              });
              artistFormArr.push(artistForm);
            });
          });
      })
    );
  }

  onSubmit(): void {
    if (this.songUploadData.isValid()) {
      const songFormData = this.songUploadData.setup();
      this.songUploadData.observable = this.songService.updateSong(songFormData, this.songId);
    }
  }

  onUploadSuccess(): void {
    this.toastService.success({ text: 'Song updated successfully!' });
    setTimeout(() => {
      this.router.navigate(['song', 'detail'], { queryParams: { id: this.songId } });
    }, 1500);
  }

  suggestArtist(value: string): void {
    this.artistService.searchArtistByName(value).subscribe(artists => (this.songUploadData.filteredSongArtists = artists));
  }
}
