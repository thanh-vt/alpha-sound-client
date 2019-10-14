import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SongService} from './song.service';
import {Song} from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class AddSongToPlaying {
  constructor(private songService: SongService) { }

  private emitChangeSource = new Subject<any>();

  changeEmitter$ = this.emitChangeSource.asObservable();

  emitChange(song: Song) {
    this.songService.listenToSong(song.id);
    this.emitChangeSource.next(song);
  }
}
