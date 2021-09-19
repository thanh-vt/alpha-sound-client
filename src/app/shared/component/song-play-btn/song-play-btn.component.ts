import { Component, Input } from '@angular/core';
import { Song } from '../../../model/song';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { AddSongToPlaylistComponent } from '../../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-song-play-btn',
  templateUrl: './song-play-btn.component.html',
  styleUrls: ['./song-play-btn.component.scss']
})
export class SongPlayBtnComponent {
  currentUser$: Observable<UserProfile>;
  @Input() song: Song;

  constructor(private authService: AuthService, private modalService: NgbModal) {
    this.currentUser$ = this.authService.currentUser$;
  }

  openPlaylistDialog(songId: number, event: Event): void {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }
}
