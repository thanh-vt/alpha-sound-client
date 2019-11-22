import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {Song} from '../models/song';
import {HttpClient} from '@angular/common/http';
import {Track} from 'ngx-audio-player';
import {SongService} from './song.service';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  currentQueueSubject: BehaviorSubject<Track[]>;
  currentQueue: Observable<Track[]>;
  queue: Track[];
  update = new EventEmitter();
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

  addToQueue(song: Song) {
    song.isDisabled = true;
    const track = {
      title: song.title,
      link: song.url
    };
    if (this.queue[0].link === '') {
      this.queue[0] = track;
      this.currentQueueSubject.next(this.queue);
      this.update.emit();
      this.subscription.add(this.songService.listenToSong(song.id).subscribe(
        () => { },
        error => { console.log(error); },
      ));
    } else {
      let isExistence = false;
      for (const trackInQueue of this.queue) {
        if (trackInQueue.link === track.link) {
          isExistence = true;
          break;
        }
      }
      if (!isExistence) {
        this.queue.push(track);
        this.currentQueueSubject.next(this.queue);
        this.update.emit();
        this.subscription.add(this.songService.listenToSong(song.id).subscribe(
          () => { },
          error => { console.log(error); },
        ));
      }
    }
  }
}
