import { Component, Input } from '@angular/core';
import { Album } from '../../../model/album';
import { AlbumService } from '../../../service/album.service';
import { SongService } from '../../../service/song.service';

@Component({
  selector: 'app-album-play-btn',
  templateUrl: './album-play-btn.component.html',
  styleUrls: ['./album-play-btn.component.scss']
})
export class AlbumPlayBtnComponent {
  @Input() album: Album;

  constructor(private albumService: AlbumService, private songService: SongService) {}

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
    });
  }
}
