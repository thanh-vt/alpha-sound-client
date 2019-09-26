import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from './service/auth.service';
import {Token} from './model/token';
import {Track} from 'ngx-audio-player';


@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  currentUser: Token;
  @Input() msaapDisplayTitle = true;
  @Input() msaapDisplayPlayList = true;
  @Input() msaapPageSizeOptions = [2, 4, 6];
  @Input() msaapDisplayVolumeControls = true;

// Material Style Advance Audio Player Playlist
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: 'http://localhost:8080/climax-sound/api/download-audio/LoiChuaNoi-TranThuHa-2433507.mp3'
    },
  ];

  @Input() msbapTitle: string;
  @Input() msbapAudioUrl: string;
  @Input() msbapDisplayTitle  = false;
  @Input() msbapDisplayVolumeControls  = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
