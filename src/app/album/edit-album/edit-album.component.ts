import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlbumUploadData } from '../../model/album-upload-data';
import { FormArray, FormBuilder } from '@angular/forms';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { ArtistService } from '../../service/artist.service';
import { VgToastService } from 'ngx-vengeance-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Album } from '../../model/album';
import { DateUtil } from '../../util/date-util';
import { SongUploadData } from '../../model/song-upload-data';
import { AuthService } from '../../service/auth.service';
import { Song } from '../../model/song';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.scss']
})
export class EditAlbumComponent implements OnInit, OnDestroy {
  album: Album;
  albumUploadData: AlbumUploadData;
  subscription: Subscription = new Subscription();
  minDate = DateUtil.getMinDate();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private artistService: ArtistService,
    private authService: AuthService,
    private toastService: VgToastService
  ) {
    this.albumUploadData = AlbumUploadData.instance({
      fb,
      router,
      albumService
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.album = await this.albumService.albumDetail(params.id).toPromise();
          this.albumUploadData.formGroup.patchValue(this.album);
          const tmpSongUploadDataList = [];
          this.album.songs = (await this.songService.getAlbumSongList(this.album.id, 0).toPromise()).content;
          this.album.songs.forEach(song => {
            const songUploadData = SongUploadData.instance(this.fb);
            songUploadData.formGroup.patchValue(song);
            const artistFormArr = songUploadData.formGroup.get('artists') as FormArray;
            artistFormArr.clear();
            song.artists.forEach(artist => {
              const artistForm = SongUploadData.createArtist(this.fb);
              artistForm.setValue(artist);
              artistFormArr.push(artistForm);
            });
            songUploadData.type = 'update';
            tmpSongUploadDataList.push(songUploadData);
          });
          this.albumUploadData.songUploadDataList = tmpSongUploadDataList;
          this.albumUploadData.holder = [];
          this.albumUploadData.checkEditableSongList(this.authService.currentUserValue.user_name);
        } catch (e) {
          console.error(e);
        }
      })
    );
  }

  async onSubmit(): Promise<void> {
    let isSongFormsValid = true;
    for (const songUploadData of this.albumUploadData.songUploadDataList) {
      if (!songUploadData.isValid()) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumUploadData.isValid() && isSongFormsValid) {
      const albumFormData: FormData = this.albumUploadData.setup();
      const createAlbumResult = await this.albumService.updateAlbum(albumFormData, this.album.id).toPromise();
      this.toastService.success({ text: 'Album updated successfully' });
      this.albumUploadData.waitAndProcessUploadSongList(createAlbumResult, true);
      for (const songUploadData of this.albumUploadData.songUploadDataList) {
        if (songUploadData.checked) {
          const songFormData: FormData = songUploadData.setup();
          if (songFormData.get('audio')) {
            songUploadData.observable =
              songUploadData.type === 'create'
                ? this.songService.uploadSong(songFormData)
                : this.songService.updateSong(songFormData, songUploadData.formGroup.get('id').value);
          }
        }
      }
    }
  }

  onUploadSongSuccess(event: Song): void {
    console.log(event);
    this.toastService.success({ text: 'Song created/updated successfully' });
  }

  onSubmitSong(songUploadData: SongUploadData): void {
    if (songUploadData.isValid()) {
      const songFormData = songUploadData.setup();
      const id = songUploadData.formGroup.get('id').value;
      if (id) {
        songUploadData.observable = this.songService.updateSong(songFormData, id);
      } else {
        songUploadData.observable = this.songService.uploadSong(songFormData);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
