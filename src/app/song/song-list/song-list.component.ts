import {Component, OnInit} from '@angular/core';
import {SongService} from '../../service/song.service';
import {Song} from '../../model/song';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';
import {Page} from '../../model/page';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalPlaylistListComponent} from '../../shared/modal-playlist-list/modal-playlist-list.component';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  playlistList: Playlist[];

  constructor(private songService: SongService, private modalService: NgbModal, private playlistService: PlaylistService, private addSongToPlaylistService: AddSongToPlaying) { }

  ngOnInit() {
    this.songService.getSongList().subscribe(
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

  open(songId) {
    this.playlistService.getPlaylistListToAdd(songId).subscribe(
      result => {
        const modalRef = this.modalService.open(ModalPlaylistListComponent);
        modalRef.componentInstance.title = 'About';
        modalRef.componentInstance.songId = songId;
        modalRef.componentInstance.playlistList = result;
      }
    );
  }

  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaylistService.emitChange(song);
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
          for (let j = 0; j < this.pages.length; j++) {
            this.pages[j] = {pageNumber: i};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }

}
