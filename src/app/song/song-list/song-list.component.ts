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
  private pageNumber: number;
  private pageSize: number;
  private totalItems: number;
  private message;
  private songList: [Song[]];
  constructor(private songService: SongService, private addSongToPlaylistService: AddSongToPlaylistService) { }

  ngOnInit() {
    this.songService.getSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index][0].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }

  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaylistService.emitChange(song);
  }

}
