import { Injectable } from '@angular/core';
import { AudioTrack } from './audio-track';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  playlist: AudioTrack[] = [];
  playlistSubject: BehaviorSubject<{ tracks: AudioTrack[]; needPlay: boolean }> = new BehaviorSubject({
    tracks: this.playlist,
    needPlay: false
  });

  constructor() {}

  addToQueue(audioTrack: AudioTrack): void {
    this.playlist = this.playlist.concat(audioTrack);
    this.notifyUpdate(false);
  }

  addAllToQueue(audioTracks: AudioTrack[]): void {
    this.playlist = this.playlist.concat(audioTracks);
    this.notifyUpdate(false);
  }

  addToQueueAndPlay(audioTrack: AudioTrack): void {
    this.playlist = this.playlist.concat(audioTrack);
    this.notifyUpdate(true);
  }

  addAllToQueueAndPlay(audioTracks: AudioTrack[]): void {
    this.playlist = this.playlist.concat(audioTracks);
    this.notifyUpdate(true);
  }

  notifyUpdate(needPlay?: boolean): void {
    this.playlistSubject.next({
      tracks: this.playlist,
      needPlay: needPlay
    });
  }
}
