import { Artist } from './artist';
import { SongUploadData } from './song-upload-data';
import { Album } from './album';
import { Subject } from 'rxjs';
import { AlbumEntryUpdate } from './album-entry-update';
import { Router } from '@angular/router';
import { AlbumService } from '../service/album.service';
import { UserInfo } from './user-info';
import { finalize } from 'rxjs/operators';

export type AlbumUploadOptions = {
  router: Router;
  albumService: AlbumService;
};

export class AlbumUploadData {
  album: Album;
  public formData: FormData;
  filteredArtists: Artist[];
  public songUploadDataList: SongUploadData[] = [];
  public recycleBin: AlbumEntryUpdate[] = [];
  private router: Router;
  private albumService: AlbumService;
  editable?: boolean;
  loading?: boolean;

  constructor(router: Router, albumService: AlbumService) {
    this.router = router;
    this.albumService = albumService;
  }

  public static instance(options: AlbumUploadOptions): AlbumUploadData {
    const instance: AlbumUploadData = new AlbumUploadData(options.router, options.albumService);
    instance.formData = new FormData();
    instance.filteredArtists = [];
    instance.initSongUploadDataList();
    return instance;
  }

  initSongUploadDataList(): SongUploadData[] {
    return [SongUploadData.instance()];
  }

  checkEditableSongList(username: string): void {
    this.songUploadDataList.forEach(songUploadData => {
      const songOwner = (songUploadData.song.uploader as UserInfo)?.username;
      songUploadData.setEditable(songOwner === username);
    });
  }

  addForm(songUploadData?: SongUploadData): void {
    if (this.songUploadDataList.length < 20) {
      if (!songUploadData) {
        songUploadData = new SongUploadData('CREATE');
        songUploadData.editable = true;
      }
      this.songUploadDataList.push(songUploadData);
    }
  }

  removeForm(i: number): void {
    if (this.songUploadDataList.length > 1) {
      const markForDeleteId = this.songUploadDataList[i].song?.id;
      if (markForDeleteId >= 0) {
        this.recycleBin.push({
          songId: markForDeleteId,
          ordinalNumber: null,
          mode: 'DELETE'
        });
      }
      this.songUploadDataList.splice(i, 1);
    }
  }

  waitAndProcessUploadSongList(createAlbumResult: Album, songUploadSubject: Subject<AlbumEntryUpdate>): void {
    this.loading = true;
    const totalFormCreate = this.songUploadDataList.filter(
      obj => obj.type === 'CREATE' || (obj.type === 'UPDATE' && obj.markForUpdate)
    ).length;
    let count = 0;
    if (totalFormCreate === 0) {
      this.albumService
        .updateSongList(
          [...this.songUploadDataList.map((e, index) => ({ songId: e.song?.id, ordinalNumber: index, mode: e.type })), ...this.recycleBin],
          createAlbumResult.id
        )
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(() => {
          setTimeout(() => {
            this.router.navigate(['album', 'detail'], { queryParams: { id: createAlbumResult.id } });
          }, 1500);
        });
    } else {
      const sub = songUploadSubject.subscribe(async () => {
        count++;
        if (count === totalFormCreate) {
          try {
            await this.albumService
              .updateSongList(
                [
                  ...this.songUploadDataList
                    .filter(e => !!e.song?.id)
                    .map((e, index) => ({
                      songId: e.song?.id,
                      ordinalNumber: index,
                      mode: e.type
                    })),
                  ...this.recycleBin
                ],
                createAlbumResult.id
              )
              .toPromise();
            sub.unsubscribe();
            setTimeout(() => {
              this.router.navigate(['album', 'detail'], { queryParams: { id: createAlbumResult.id } });
            }, 1500);
          } catch (e) {
            console.error(e);
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
}
