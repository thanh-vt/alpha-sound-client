import {Component, OnInit} from '@angular/core';
import {SongService} from '../../service/song.service';
import {Song} from '../../model/song';
import {AddSongToPlaylistService} from '../../service/add-song-to-playlist.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  private message;
  private songList: Song[];
  constructor(private songService: SongService, private addSongToPlaylistService: AddSongToPlaylistService) { }

  ngOnInit() {
    this.songService.getSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.message;
      }
    );
  }

  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaylistService.emitChange(song);
  }

}
