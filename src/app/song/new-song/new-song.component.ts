import { Component, OnInit } from '@angular/core';
import {Song} from '../../model/song';
import {SongService} from '../../service/song.service';
import {Page} from '../../model/page';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';
@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss']
})
export class NewSongComponent implements OnInit {

  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  constructor(private songService: SongService, private addSongToPlaying: AddSongToPlaying) { }

  ngOnInit() {
    this.songService.getNewSong().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let i = 0; i < this.pages.length; i++) {
            this.pages[i] = {pageNumber: i};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }
  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaying.emitChange(song);
  }
  goToPage(i) {
    this.songService.getSongListPage(i).subscribe(
      result => {
        if (result != null) {
          window.scroll(0, 0);
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let i = 0; i < this.pages.length; i++) {
            this.pages[i] = {pageNumber: i};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }
}
