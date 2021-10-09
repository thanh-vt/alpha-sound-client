import { Injectable } from '@angular/core';
import { AudioTrack } from './audio-track';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayingQueueService {
  playlist: AudioTrack[] = [];
  private playlistSubject: BehaviorSubject<{ tracks: AudioTrack[]; needPlay: boolean; index: number }> = new BehaviorSubject({
    tracks: this.playlist,
    needPlay: false,
    index: 0
  });
  playListObs: Observable<{ tracks: AudioTrack[]; needPlay: boolean; index: number }> = this.playlistSubject.asObservable();
  trackEvent: BehaviorSubject<{ track: AudioTrack; event: string }> = new BehaviorSubject(null);

  addToQueue(audioTrack: AudioTrack): void {
    this.playlist = this.playlist.concat(audioTrack);
    this.notifyUpdate(null, false);
  }

  addAllToQueue(audioTracks: AudioTrack[]): void {
    this.playlist = this.playlist.concat(audioTracks);
    this.notifyUpdate(null, false);
  }

  addToQueueAndPlay(audioTrack: AudioTrack): void {
    if (this.checkAlreadyInQueue(audioTrack.url)) {
      return;
    }
    this.playlist = this.playlist.concat(audioTrack);
    const indexToPlay = this.playlist.indexOf(audioTrack);
    this.notifyUpdate(indexToPlay, true);
  }

  addAllToQueueAndPlay(audioTracks: AudioTrack[]): void {
    const firstTrack = audioTracks[0];
    this.playlist = this.playlist.concat(audioTracks);
    const indexToPlay = this.playlist.indexOf(firstTrack);
    this.notifyUpdate(indexToPlay, true);
  }

  notifyUpdate(index: number, needPlay?: boolean): void {
    this.playlistSubject.next({
      tracks: this.playlist,
      needPlay: needPlay,
      index
    });
  }

  checkAlreadyInQueue(inputUrl: string | undefined): boolean {
    return this.playlist.map(track => track.url).some(url => url === inputUrl);
  }
}
