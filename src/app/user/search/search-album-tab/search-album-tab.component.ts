import { Component, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Album } from '../../../model/album';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { AuthService } from '../../../service/auth.service';
import { exhaustMap } from 'rxjs/operators';
import { AlbumService } from '../../../service/album.service';
import { SongService } from '../../../service/song.service';
import { FavoritesService } from '../../../service/favorites.service';

@Component({
  selector: 'app-search-album-tab',
  templateUrl: './search-album-tab.component.html',
  styleUrls: ['./search-album-tab.component.scss']
})
export class SearchAlbumTabComponent implements OnDestroy {
  currentUser$: Observable<UserProfile>;
  @Input() searchText: string;
  @Input() albumList: Album[] = [];
  currentPage = 0;
  scrollEvent: EventEmitter<void> = new EventEmitter<void>();
  sub: Subscription = new Subscription();

  constructor(
    private albumService: AlbumService,
    private songService: SongService,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.sub = this.scrollEvent
      .pipe(exhaustMap(() => this.albumService.searchAlbumByName(this.searchText, this.currentPage + 1)))
      .subscribe(albumPage => {
        const albumList = albumPage.content;
        if (albumList.length && albumPage.pageable.pageNumber > this.currentPage) {
          this.currentPage++;
          this.favoritesService.patchLikes(albumList, 'ALBUM');
          this.albumList = this.albumList.concat(albumList);
        }
      });
  }

  onScroll(): void {
    this.scrollEvent.emit();
  }

  addAlbumToPlaying(album: Album, event: Event): void {
    event.stopPropagation();
    album.isDisabled = true;
    this.albumService.albumDetail(album.id).subscribe(next => {
      this.songService.playAlbum(next);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
