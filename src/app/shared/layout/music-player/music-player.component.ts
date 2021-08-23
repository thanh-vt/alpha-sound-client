import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PlayingQueueService } from './playing-queue.service';
import { AudioTrack } from './audio-track';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  providers: [NgbDropdownConfig]
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
  tracks: AudioTrack[] = [];
  index = 0;
  mediaPath = 'https://archive.org/download/mythium/';
  extension = '';
  title = '';
  action = '';
  isRepeat = false;
  isShuffle = false;
  isShowTrackList = false;
  @ViewChild('audio') audioRef: ElementRef<HTMLAudioElement>;
  noSupportHtml5Audio = false;

  constructor(config: NgbDropdownConfig, private playingQueueService: PlayingQueueService) {
    // customize default values of dropdowns used by this component tree
    config.placement = 'top-left';
    config.autoClose = false;
    this.playingQueueService.playlistSubject.subscribe(next => {
      this.tracks = next.tracks;
      if (this.tracks.length && next.needPlay) {
        setTimeout(() => {
          this.playTrack(this.tracks.length - 1);
        }, 500);
      }
    });
  }

  ngOnInit(): void {
    console.log('init');
  }

  ngAfterViewInit(): void {
    this.extension = this.audioRef.nativeElement.canPlayType('audio/mpeg')
      ? '.mp3'
      : this.audioRef.nativeElement.canPlayType('audio/ogg')
      ? '.ogg'
      : '';
    if (this.extension) {
      if (this.tracks.length) {
        this.loadTrack(this.index);
      }
    } else {
      this.noSupportHtml5Audio = true;
    }
  }

  play() {
    this.action = 'Now Playing...';
  }

  pause() {
    this.action = 'Paused...';
  }

  ended() {
    this.action = 'Paused...';
    if (this.isShuffle) {
      this.index = this.getRandomArbitrary(0, this.tracks.length - 1);
      console.log('random', this.index);
      this.loadTrack(this.index);
      this.audioRef.nativeElement.play();
    } else {
      if (this.index + 1 < this.tracks.length) {
        this.index++;
        this.loadTrack(this.index);
        this.audioRef.nativeElement.play();
      } else {
        this.audioRef.nativeElement.pause();
        this.index = 0;
        this.loadTrack(this.index);
        if (this.isRepeat) {
          this.audioRef.nativeElement.play();
        }
      }
    }
  }

  loadTrack(id: number) {
    this.title = this.tracks[id].name;
    this.index = id;
    this.audioRef.nativeElement.src = this.mediaPath + this.tracks[id].file + this.extension;
  }

  playTrack(id: number) {
    if (id !== this.index) {
      this.loadTrack(id);
      this.audioRef.nativeElement.play();
    }
  }

  first() {
    if (this.tracks.length) {
      this.index = 0;
      this.loadTrack(this.index);
      this.audioRef.nativeElement.play();
    }
  }

  prev() {
    if (this.index - 1 > -1) {
      this.index--;
      this.loadTrack(this.index);
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
      this.index = 0;
      this.loadTrack(this.index);
    }
  }

  next() {
    if (this.index + 1 < this.tracks.length) {
      this.index++;
      this.loadTrack(this.index);
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
      this.index = 0;
      this.loadTrack(this.index);
    }
  }

  last() {
    if (this.tracks.length) {
      this.index = this.tracks.length - 1;
      this.loadTrack(this.index);
      this.audioRef.nativeElement.play();
    }
  }

  jump(ref: HTMLAudioElement, evt: any) {
    ref.currentTime = Number(evt.target.value);
    // ref.play();
    // ref.pause();
    // ref.currentTime = Number(evt.target.value);
    // setTimeout(() => {
    //   ref.play();
    // }, 100);
  }

  changeVolume(audio: HTMLAudioElement, event: Event) {
    audio.volume = Number((event.target as any).value);
    audio.muted = audio.volume === 0;
  }

  toggleMute(ref: HTMLAudioElement) {
    ref.muted = !ref.muted;
    if (!ref.muted && ref.volume === 0) {
      ref.volume = 0.5;
    }
  }

  togglePlay(ref: HTMLAudioElement) {
    if (ref.paused) {
      ref.play();
    } else {
      ref.pause();
    }
  }

  toggleTrackList(event: boolean, plList: HTMLUListElement) {
    this.isShowTrackList = event;
    if (this.isShowTrackList) {
      setTimeout(() => {
        plList.focus();
      }, 0);
    }
  }

  toggleReplay() {
    this.isRepeat = !this.isRepeat;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
  }

  getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  blur() {
    console.log('blur');
  }
}
