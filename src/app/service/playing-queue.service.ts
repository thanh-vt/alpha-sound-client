import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Song } from '../model/song';
import { HttpClient } from '@angular/common/http';
import { SongService } from './song.service';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  currentQueueSubject: BehaviorSubject<any[]>;
  currentQueue: Observable<any[]>;
  queue: any[];
  update = new EventEmitter();
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private songService: SongService) {
    this.queue = [
      {
        title: '',
        link: ''
      }
    ];
    this.currentQueueSubject = new BehaviorSubject<any[]>(this.queue);
    this.currentQueue = this.currentQueueSubject.asObservable();
  }

  public get currentQueueValue(): any[] {
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
      this.songService.listenToSong(song.id).subscribe();
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
        this.songService.listenToSong(song.id).subscribe();
      }
    }
  }
}
