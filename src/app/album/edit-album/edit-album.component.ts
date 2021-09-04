import { Component, OnDestroy, OnInit } from '@angular/core';
import { artistModelToImgSrcMapper, artistModelToTextMapper } from '../../util/mapper.util';
import { AlbumUploadData } from '../../model/album-upload-data';
import { SongUploadData } from '../../model/song-upload-data';
import { FormArray, FormBuilder } from '@angular/forms';
import { AlbumService } from '../../service/album.service';
import { SongService } from '../../service/song.service';
import { ArtistService } from '../../service/artist.service';
import { VgToastService } from 'ngx-vengeance-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { BaseUploadComponent } from '../../common/base-upload.component';
import { Album } from '../../model/album';
import { DateUtil } from '../../util/date-util';
import { AlbumUpdate } from '../../model/album-update';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.scss']
})
export class EditAlbumComponent extends BaseUploadComponent implements OnInit, OnDestroy {
  album: Album;
  modelToTextMapper = artistModelToTextMapper;
  modelToImgSrcMapper = artistModelToImgSrcMapper;
  albumUploadData: AlbumUploadData = this.initAlbumUploadData();
  songUploadDataList: SongUploadData[] = this.initSongUploadDataList();
  subscription: Subscription = new Subscription();
  minDate = DateUtil.getMinDate();
  holder: AlbumUpdate[] = [];
  songUploadSubject: Subject<AlbumUpdate> = new Subject<AlbumUpdate>();

  constructor(
    protected fb: FormBuilder,
    private route: ActivatedRoute,
    protected router: Router,
    protected albumService: AlbumService,
    private songService: SongService,
    protected artistService: ArtistService,
    private toastService: VgToastService
  ) {
    super(fb, router, artistService, albumService);
  }

  protected getAlbumUploadData(): AlbumUploadData {
    return this.albumUploadData;
  }

  protected getSongUploadDataList(): SongUploadData[] {
    return this.songUploadDataList;
  }

  protected getHolder(): AlbumUpdate[] {
    return this.holder;
  }

  protected getSongUploadSubject(): Subject<AlbumUpdate> {
    return this.songUploadSubject;
  }

  protected setSongUploadSubject(subject: Subject<AlbumUpdate>): void {
    this.songUploadSubject = subject;
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
            const songUploadData = this.initSongUploadData();
            songUploadData.formGroup.patchValue(song);
            const artistFormArr = songUploadData.formGroup.get('artists') as FormArray;
            artistFormArr.clear();
            song.artists.forEach(artist => {
              const artistForm = this.createArtist();
              artistForm.setValue(artist);
              artistFormArr.push(artistForm);
            });
            songUploadData.type = 'update';
            tmpSongUploadDataList.push(songUploadData);
          });
          this.songUploadDataList = tmpSongUploadDataList;
          this.holder = [];
        } catch (e) {
          console.error(e);
        }
      })
    );
  }

  async onSubmit(): Promise<void> {
    let isSongFormsValid = true;
    for (const songUploadData of this.songUploadDataList) {
      if (!songUploadData.isValid()) {
        isSongFormsValid = false;
        break;
      }
    }
    if (this.albumUploadData.isValid() && isSongFormsValid) {
      const albumFormData: FormData = this.albumUploadData.setup();
      const createAlbumResult = await this.albumService.updateAlbum(albumFormData, this.album.id).toPromise();
      this.toastService.success({ text: 'Album updated successfully' });
      this.waitAndProcessUploadSongList(createAlbumResult);
      for (const songUploadData of this.songUploadDataList) {
        const songFormData: FormData = songUploadData.setup();
        songUploadData.observable =
          songUploadData.type === 'create'
            ? this.songService.uploadSong(songFormData)
            : this.songService.updateSong(songFormData, songUploadData.formGroup.get('id').value);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
