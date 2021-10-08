import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { Artist } from '../../../model/artist';
import { SongService } from '../../../service/song.service';
import { AuthService } from '../../../service/auth.service';
import { exhaustMap } from 'rxjs/operators';
import { ArtistService } from '../../../service/artist.service';
import { FavoritesService } from '../../../service/favorites.service';

@Component({
  selector: 'app-search-artist-tab',
  templateUrl: './search-artist-tab.component.html',
  styleUrls: ['./search-artist-tab.component.scss']
})
export class SearchArtistTabComponent implements OnDestroy {
  currentUser$: Observable<UserProfile>;
  @Input() searchText: string;
  @Input() artistList: Artist[] = [];
  currentPage = 0;
  scrollEvent: EventEmitter<void> = new EventEmitter<void>();
  sub: Subscription = new Subscription();

  constructor(
    private artistService: ArtistService,
    private songService: SongService,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.sub = this.scrollEvent
      .pipe(exhaustMap(() => this.artistService.searchArtistByName(this.searchText, this.currentPage + 1)))
      .subscribe(artistPage => {
        const artistList = artistPage.content;
        if (artistList.length && artistPage.pageable.pageNumber > this.currentPage) {
          this.currentPage++;
          this.favoritesService.patchLikes(artistList, 'ARTIST');
          this.artistList = this.artistList.concat(artistList);
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
