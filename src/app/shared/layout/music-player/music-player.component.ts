import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PlayingQueueService } from './playing-queue.service';
import { AudioTrack } from './audio-track';
import { Subscription } from 'rxjs';
import { VgToastService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  providers: [NgbDropdownConfig]
})
export class MusicPlayerComponent implements OnDestroy {
  tracks: AudioTrack[] = [];
  currentTrackIndex = -1;
  action = '';
  isRepeat = false;
  isShuffle = false;
  noSupportHtml5Audio = false;
  queueSub = new Subscription();
  @ViewChild('audio') audioRef: ElementRef<HTMLAudioElement>;

  constructor(
    config: NgbDropdownConfig,
    private playingQueueService: PlayingQueueService,
    private translate: TranslateService,
    private toastService: VgToastService
  ) {
    // customize default values of dropdowns used by this component tree
    config.placement = 'top-left';
    config.autoClose = false;
    this.queueSub = this.playingQueueService.playListObs.subscribe(
      next => {
        this.tracks = next.tracks;
        if (this.tracks.length && next.needPlay) {
          setTimeout(() => {
            const lastIndex = this.tracks.length - 1;
            if (lastIndex >= 0) {
              this.playTrack(lastIndex, this.tracks[lastIndex]);
            }
          }, 500);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  // ngAfterViewInit(): void {
  // this.extension = this.audioRef.nativeElement.canPlayType('audio/mpeg')
  //   ? '.mp3'
  //   : this.audioRef.nativeElement.canPlayType('audio/ogg')
  //   ? '.ogg'
  //   : '';
  // if (this.extension) {
  //   if (this.tracks.length) {
  //     this.loadTrack(this.index);
  //   }
  // } else {
  //   this.noSupportHtml5Audio = true;
  // }
  // }?

  onLoadMetadata(): void {
    this.tracks[this.currentTrackIndex].duration = this.audioRef.nativeElement.duration;
  }

  onPlay(): void {
    this.action = this.translate.instant('feature.song.playing');
  }

  onPause(): void {
    this.action = this.translate.instant('feature.song.paused');
  }

  onEnded(): void {
    this.action = this.translate.instant('feature.song.paused');
    if (this.isShuffle) {
      this.currentTrackIndex = this.getRandomArbitrary(0, this.tracks.length - 1);
      this.loadTrack(this.currentTrackIndex);
      this.audioRef.nativeElement.play();
    } else {
      if (this.currentTrackIndex + 1 < this.tracks.length) {
        this.currentTrackIndex++;
        this.loadTrack(this.currentTrackIndex);
        this.audioRef.nativeElement.play();
      } else {
        this.audioRef.nativeElement.pause();
        this.currentTrackIndex = 0;
        this.loadTrack(this.currentTrackIndex);
        if (this.isRepeat) {
          this.audioRef.nativeElement.play();
        }
      }
    }
  }

  loadTrack(id: number): void {
    this.currentTrackIndex = id;
    this.audioRef.nativeElement.src = this.tracks[id].url;
  }

  playTrack(id: number, track: AudioTrack): void {
    if (id !== this.currentTrackIndex) {
      this.loadTrack(id);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.audioRef.nativeElement.ontimeupdate = () => {};
      this.audioRef.nativeElement.play().then(() => {
        this.playingQueueService.trackEvent.next({
          track,
          event: 'play'
        });
      });
    }
  }

  first(): void {
    if (this.tracks.length) {
      this.currentTrackIndex = 0;
      this.loadTrack(this.currentTrackIndex);
      this.audioRef.nativeElement.play();
    }
  }

  prev(): void {
    if (this.currentTrackIndex - 1 > -1) {
      this.currentTrackIndex--;
      this.loadTrack(this.currentTrackIndex);
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
      this.currentTrackIndex = 0;
      this.loadTrack(this.currentTrackIndex);
    }
  }

  next(): void {
    if (this.currentTrackIndex + 1 < this.tracks.length) {
      this.currentTrackIndex++;
      this.loadTrack(this.currentTrackIndex);
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
      this.currentTrackIndex = 0;
      this.loadTrack(this.currentTrackIndex);
    }
  }

  last(): void {
    if (this.tracks.length) {
      this.currentTrackIndex = this.tracks.length - 1;
      this.loadTrack(this.currentTrackIndex);
      this.audioRef.nativeElement.play();
    }
  }

  jump(ref: HTMLAudioElement, event: Event): void {
    ref.currentTime = Number((event.target as HTMLInputElement).value);
  }

  changeVolume(audio: HTMLAudioElement, event: Event): void {
    audio.volume = Number((event.target as HTMLInputElement).value);
    audio.muted = audio.volume === 0;
  }

  toggleMute(ref: HTMLAudioElement): void {
    ref.muted = !ref.muted;
    if (!ref.muted && ref.volume === 0) {
      ref.volume = 0.5;
    }
  }

  togglePlay(ref: HTMLAudioElement): void {
    if (ref.paused) {
      ref.play();
    } else {
      ref.pause();
    }
  }

  toggleReplay(): void {
    this.isRepeat = !this.isRepeat;
  }

  toggleShuffle(): void {
    this.isShuffle = !this.isShuffle;
  }

  getRandomArbitrary(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnDestroy(): void {
    this.playingQueueService.notifyUpdate(false);
    this.queueSub.unsubscribe();
  }

  removeAudio(i: number): void {
    this.toastService.error({ text: this.translate.instant('feature.song.load_error') });
    const currentTrack = this.tracks[this.currentTrackIndex];
    if (this.currentTrackIndex === i) {
      this.currentTrackIndex = -1;
      this.audioRef.nativeElement.pause();
      this.audioRef.nativeElement.removeAttribute('src');
    }
    const [deletedTrack] = this.tracks.splice(i, 1);
    this.currentTrackIndex = this.tracks.indexOf(currentTrack);
    this.playingQueueService.playlist.splice(i, 1);
    this.playingQueueService.trackEvent.next({
      track: deletedTrack,
      event: 'remove'
    });
  }
}
