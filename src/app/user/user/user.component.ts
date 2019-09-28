import {Component, Input, OnInit} from '@angular/core';
import {Token} from '../../model/token';
import {Track} from 'ngx-audio-player';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentUser: Token;
  @Input() msaapDisplayTitle = true;
  @Input() msaapDisplayPlayList = true;
  @Input() msaapPageSizeOptions = [2, 4, 6];
  @Input() msaapDisplayVolumeControls = true;

// Material Style Advance Audio Player Playlist
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: ''
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

  ngOnInit() {
  }

}
