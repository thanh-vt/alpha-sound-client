import { Component, OnInit } from '@angular/core';
import { SongService } from '../../service/song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../service/artist.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { SongUploadData } from '../../model/song-upload-data';
import { firstValueFrom, Subscription } from 'rxjs';
import { DateUtil } from '../../util/date-util';
import { CountryService } from '../../service/country.service';
import { AuthService } from '../../service/auth.service';

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
    private router: Router,
    private authService: AuthService,
    private songService: SongService,
    private countryService: CountryService,
    private artistService: ArtistService,
    private toastService: VgToastService,
    private loaderServer: VgLoaderService
  ) {
    this.songUploadData = SongUploadData.instance();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.songId = params.id;
          this.loaderServer.loading(true);
          this.songUploadData.song = await firstValueFrom(this.songService.songDetail(this.songId));
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderServer.loading(false);
        }
      })
    );
  }

  onSubmit(): void {
    this.songUploadData.observable = this.songService.updateSong(this.songUploadData.formData, this.songId);
  }

  onUploadSuccess(): void {
    this.toastService.success({ text: 'Song updated successfully!' });
    setTimeout(() => {
      this.router.navigate(['song', 'detail'], { queryParams: { id: this.songId } });
    }, 1500);
  }
}
