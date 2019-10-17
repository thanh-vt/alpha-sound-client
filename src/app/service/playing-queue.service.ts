import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Song} from '../model/song';
import {HttpClient} from '@angular/common/http';
import {Track} from 'ngx-audio-player';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  currentQueueSubject: BehaviorSubject<Track[]>;
  currentQueue: Observable<Track[]>;
  update = new EventEmitter();
  queue: Track[];

  constructor(private http: HttpClient) {
    this.queue = [{
        title: '',
        link: ''
      }];
    this.currentQueueSubject = new BehaviorSubject<Track[]>(this.queue);
    this.currentQueue = this.currentQueueSubject.asObservable();

  }

  public get currentQueueValue(): Track[] {
    return this.currentQueueSubject.value;
  }

  addToQueue(track: Track) {
    if (this.queue[0].link === '') {
      this.queue[0] = track;
    } else {
      this.queue.push(track);
    }
    this.currentQueueSubject.next(this.queue);
    this.update.emit();
  }


  emitChange(song: Song) {
    // this.songService.listenToSong(song.id);
    // this.emitChangeSource.next(song);
  }
}
