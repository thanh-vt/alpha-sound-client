import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {Song} from '../model/song';
import {HttpClient} from '@angular/common/http';
import {Track} from 'ngx-audio-player';
import {SongService} from './song.service';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  currentQueueSubject: BehaviorSubject<Track[]>;
  currentQueue: Observable<Track[]>;
  update = new EventEmitter();
  queue: Track[];
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private songService: SongService) {
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

  addToQueue(track: Track, songId?: number) {
    if (this.queue[0].link === '') {
      this.queue[0] = track;
      this.currentQueueSubject.next(this.queue);
      this.update.emit();
    } else {
      let isExistence = false;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.queue.length; i++) {
        if (this.queue[i].link === track.link) {
          isExistence = true;
          break;
        }
      }
      if (!isExistence) {
        this.queue.push(track);
        this.currentQueueSubject.next(this.queue);
        this.subscription.add(this.songService.listenToSong(songId).subscribe(
          () => {
            this.update.emit();
          }
        ));
      }
    }
  }


  emitChange(song: Song) {
    // this.songService.listenToSong(song.id);
    // this.emitChangeSource.next(song);
  }
}
