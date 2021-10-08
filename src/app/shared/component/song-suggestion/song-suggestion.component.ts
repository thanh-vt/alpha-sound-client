import { Component } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { Song } from '../../../model/song';
import { SongService } from '../../../service/song.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type NgbTypeaheadSelectItemEvent<T> = {
  item: T;
  preventDefault: () => void;
};

@Component({
  selector: 'app-song-search-dialog',
  templateUrl: './song-suggestion.component.html',
  styleUrls: ['./song-suggestion.component.scss']
})
export class SongSuggestionComponent {
  public selectedSong: Song;

  constructor(private songService: SongService, private ref: NgbActiveModal) {}

  formatter: (song: Song) => string = (song: Song) =>
    `${song.title} ${song.artists.length ? ' - ' : ''} ${song.artists?.map(artist => artist.name)?.join(',')}`;

  search: OperatorFunction<string, readonly Song[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      switchMap(phrase => this.songService.searchSongByName(phrase)),
      map(songPage => songPage.content)
    );

  selectSong(event: NgbTypeaheadSelectItemEvent<Song>): void {
    this.selectedSong = event.item;
  }

  close(song?: Song): void {
    this.ref.close(song);
  }
}
