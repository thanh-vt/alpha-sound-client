export interface AlbumUpdate {
  songId: number;
  order: number;
  mode: 'CREATE' | 'DELETE';
}
