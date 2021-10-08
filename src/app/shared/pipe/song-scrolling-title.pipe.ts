import { Pipe, PipeTransform } from '@angular/core';
import { AudioTrack } from '../layout/music-player/audio-track';

@Pipe({
  name: 'songScrollingTitle'
})
export class SongScrollingTitlePipe implements PipeTransform {
  transform(value: AudioTrack): unknown {
    if (value) {
      return value.title + ' - ' + value.artist;
    } else {
      return '';
    }
  }
}
