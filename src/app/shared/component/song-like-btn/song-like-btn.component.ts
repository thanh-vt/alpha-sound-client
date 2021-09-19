import { Component, Input } from '@angular/core';
import { Song } from '../../../model/song';
import { SongService } from '../../../service/song.service';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';

@Component({
  selector: 'app-song-like-btn',
  templateUrl: './song-like-btn.component.html',
  styleUrls: ['./song-like-btn.component.scss']
})
export class SongLikeBtnComponent {
  currentUser$: Observable<UserProfile>;
  @Input() song: Song;

  constructor(private authService: AuthService, private songService: SongService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  likeSong(song: Song, event: Event, isLiked: boolean): void {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
  }
}
