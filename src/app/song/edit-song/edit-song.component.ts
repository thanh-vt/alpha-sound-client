import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { SongService } from '../../service/song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../service/artist.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';
import { Subscription } from 'rxjs';
import { DateUtil } from '../../util/date-util';
import { CountryService } from '../../service/country.service';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit {
  songId: number;
  songUploadData: SongUploadData;
  subscription: Subscription = new Subscription();
  minDate = DateUtil.getMinDate();

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private songService: SongService,
    private countryService: CountryService,
    protected fb: FormBuilder,
    protected artistService: ArtistService,
    private toastService: VgToastService,
    private loaderServer: VgLoaderService
  ) {
    this.songUploadData = SongUploadData.instance(fb);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.songId = params.id;
          this.loaderServer.loading(true);
          const result = await this.songService.songDetail(this.songId).toPromise();
          this.songUploadData.formGroup.patchValue({
            title: result.title,
            releaseDate: result.releaseDate,
            url: result.url,
            country: result.country
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
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderServer.loading(false);
        }
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
}
