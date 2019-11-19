import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PlaylistService} from '../../services/playlist.service';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-add-song-to-playlist',
  templateUrl: './add-song-to-playlist.component.html',
  styleUrls: ['./add-song-to-playlist.component.scss']
})
export class AddSongToPlaylistComponent implements OnInit, OnDestroy {

  @Input() songId: number;
  @Input() playlistList: Playlist[] = [];
  closeResult: string;
  message: string;
  loading: boolean;
  subscription: Subscription = new Subscription();
  error: boolean;

  constructor(private modalService: NgbModal, private playlistService: PlaylistService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.loading = true;
    this.subscription.add(this.playlistService.getPlaylistListToAdd(this.songId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
      result => {
        this.playlistList = result;
      }, error => {
        this.message = 'An error has occurred.';
        console.log(error.message);
      }
    ));
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
    this.subscription.add(this.playlistService.addSongToPlaylist(songId, playlistId).subscribe(
      () => {
        this.error = false;
        this.message = 'Song added to playlist';
        this.subscription.add(this.playlistService.getPlaylistListToAdd(this.songId).subscribe(
          result => {
            this.error = false;
            this.playlistList = result;
          }, error1 => {
            this.error = true;
            this.message = 'Cannot retrieve playlist list. Cause: ' + error1.message;
          }
        ));
      }, error => {
        this.error = true;
        this.message = 'Cannot add song to playlist. Cause: ' + error.message;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
