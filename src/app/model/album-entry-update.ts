import { SongUploadType } from './song-upload-data';

export interface AlbumEntryUpdate {
  songId: number;
  ordinalNumber: number;
  mode: SongUploadType;
}
