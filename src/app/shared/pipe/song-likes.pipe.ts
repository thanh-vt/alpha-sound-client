import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../../model/song';
import { SongService } from '../../service/song.service';

@Pipe({
  name: 'songLikes'
})
export class SongLikesPipe implements PipeTransform {
  constructor(private songService: SongService) {}

  transform(value: Song[], ...args: unknown[]): Song[] {
    if (args[0]) {
      this.songService.patchLikes(value);
    }
    return value;
  }
}
