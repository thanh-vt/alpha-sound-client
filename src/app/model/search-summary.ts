import { PagingInfo } from './paging-info';
import { Song } from './song';
import { Artist } from './artist';
import { Album } from './album';

export interface SearchSummary {
  song: PagingInfo<Song>;
  artist: PagingInfo<Artist>;
  album: PagingInfo<Album>;
}
