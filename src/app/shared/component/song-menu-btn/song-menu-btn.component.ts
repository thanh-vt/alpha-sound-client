import { Component, Input } from '@angular/core';
import { Song } from '../../../model/song';
import { SongService } from '../../../service/song.service';

@Component({
  selector: 'app-song-menu-btn',
  templateUrl: './song-menu-btn.component.html',
  styleUrls: ['./song-menu-btn.component.scss']
})
export class SongMenuBtnComponent {
  @Input() song: Song;

  constructor(private songService: SongService) {}

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }
}
