import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { Song } from '../../../model/song';
import { AuthService } from '../../../service/auth.service';
import { SongService } from '../../../service/song.service';
import { exhaustMap } from 'rxjs/operators';
import { FavoritesService } from '../../../service/favorites.service';

@Component({
  selector: 'app-search-song-tab',
  templateUrl: './search-song-tab.component.html',
  styleUrls: ['./search-song-tab.component.scss']
})
export class SearchSongTabComponent implements OnDestroy {
  currentUser$: Observable<UserProfile>;
  @Input() searchText: string;
  @Input() songList: Song[] = [];
  currentPage = 0;
  scrollEvent: EventEmitter<void> = new EventEmitter<void>();
  sub: Subscription = new Subscription();

  constructor(private songService: SongService, private authService: AuthService, private favoritesService: FavoritesService) {
    this.currentUser$ = this.authService.currentUser$;
    this.sub = this.scrollEvent
      .pipe(exhaustMap(() => this.songService.searchSongByName(this.searchText, this.currentPage + 1)))
      .subscribe(songPage => {
        const songList = songPage.content;
        if (songList.length && songPage.pageable.pageNumber > this.currentPage) {
          this.currentPage++;
          this.favoritesService.patchLikes(songList, 'SONG');
          this.songList = this.songList.concat(songList);
        }
      });
  }

  onScroll(): void {
    this.scrollEvent.emit();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
