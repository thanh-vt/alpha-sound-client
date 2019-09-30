import {Component, Input, OnInit} from '@angular/core';
import {Token} from '../../model/token';
import {Track} from 'ngx-audio-player';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {AddSongToPlaylistService} from '../../service/add-song-to-playlist.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username: string;
  currentUser: Token;
  isLoggedIn: boolean;
  numberOfTracks = 1;
  @Input() msaapDisplayTitle = true;
  @Input() msaapDisplayPlayList = true;
  @Input() msaapPageSizeOptions = [6];
  @Input() msaapDisplayVolumeControls = true;
  @Input() expanded = false;

// Material Style Advance Audio Player Playlist
  msaapPlaylist: Track[] = [
    {
      title: '',
      link: ''
    }
  ];

  constructor(private router: Router, private authService: AuthService, private addSongToPlaylistService: AddSongToPlaylistService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.addSongToPlaylistService.changeEmitter$.subscribe(data => {
      if (this.numberOfTracks === 1) {
        this.msaapPlaylist[0] = {
          title: data.name,
          link: data.url
        };
        this.numberOfTracks++;
      } else {
        this.msaapPlaylist.push({
          title: data.name,
          link: data.url
        });
        this.numberOfTracks = this.msaapPlaylist.length;
      }
    });
  }

  onActivate(elementRef) {
    elementRef.loginAction.subscribe((next) => {
      this.isLoggedIn = true;
      this.username = next.username;
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    // window.location.reload();
  }

  ngOnInit() {
  }

}
