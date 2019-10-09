import {Component, Input, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-song-to-playlist',
  templateUrl: './add-song-to-playlist.component.html',
  styleUrls: ['./add-song-to-playlist.component.scss']
})
export class AddSongToPlaylistComponent implements OnInit {

  @Input() songId: number;
  playlistList: Playlist[] = [];
  closeResult: string;
  message: string;
  subscription: Subscription = new Subscription();

  constructor(private modalService: NgbModal, private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.subscription.unsubscribe();
    this.subscription = this.playlistService.getPlaylistList().subscribe(
      result => {
        this.playlistList = result.content;
      }, error => {
        this.message = 'Cannot retrieve playlist list. Cause: ' + error.message;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  addSongToPlaylist(songId: number, playlistId: number) {
    this.playlistService.addSongToPlaylist(songId, playlistId).subscribe(
      () => {
        this.message = 'Song added to playlist';
      }, error => {
        this.message = 'Cannot add song to playlist. Cause: ' + error.message;
      }
    );
  }

  createPlaylist() {
    this.subscription.unsubscribe();
    this.subscription = this.playlistService.getPlaylistList().subscribe(
      result => {
        this.playlistList = result.content;
      }, error => {
        this.message = 'Cannot retrieve playlist list. Cause: ' + error.message;
      }
    );
  }
}
