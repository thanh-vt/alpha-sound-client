import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchSummary } from '../../../model/search-summary';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { AuthService } from '../../../service/auth.service';
import { Album } from '../../../model/album';
import { AlbumService } from '../../../service/album.service';
import { SongService } from '../../../service/song.service';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.scss']
})
export class SearchSummaryComponent {
  currentUser$: Observable<UserProfile>;
  @Input() searchText: string;
  @Input() searchSummary: SearchSummary;
  @Output() changeTabEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private authService: AuthService, private albumService: AlbumService, private songService: SongService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  changeTab(tabId: string): void {
    this.changeTabEvent.emit(tabId);
  }

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
    });
  }
}
