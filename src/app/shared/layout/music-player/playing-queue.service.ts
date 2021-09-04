import { Injectable } from '@angular/core';
import { AudioTrack } from './audio-track';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  playlist: AudioTrack[] = [];
  private playlistSubject: BehaviorSubject<{ tracks: AudioTrack[]; needPlay: boolean }> = new BehaviorSubject({
    tracks: this.playlist,
    needPlay: false
  });
  playListObs: Observable<{ tracks: AudioTrack[]; needPlay: boolean }> = this.playlistSubject.asObservable();
  trackEvent: BehaviorSubject<{ track: AudioTrack; event: string }> = new BehaviorSubject(null);

  addToQueue(audioTrack: AudioTrack): void {
    this.playlist = this.playlist.concat(audioTrack);
    this.notifyUpdate(false);
  }

  addAllToQueue(audioTracks: AudioTrack[]): void {
    this.playlist = this.playlist.concat(audioTracks);
    this.notifyUpdate(false);
  }

  addToQueueAndPlay(audioTrack: AudioTrack): void {
    if (this.checkAlreadyInQueue(audioTrack.url)) {
      return;
    }
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

  checkAlreadyInQueue(inputUrl: string | undefined): boolean {
    return this.playlist.map(track => track.url).some(url => url === inputUrl);
  }
}
