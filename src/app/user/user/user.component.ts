import {Component, Input, OnInit} from '@angular/core';
import {UserToken} from '../../model/userToken';
import {Track} from 'ngx-audio-player';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username: string;
  currentUser: UserToken;
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

  constructor(private router: Router, private authService: AuthService, private addSongToPlaying: AddSongToPlaying) {

  }

  logIn(event) {
    this.isLoggedIn = true;
    this.username = event;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    // window.location.reload();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      this.username = JSON.parse(localStorage.getItem('userToken')).username;
      this.addSongToPlaying.changeEmitter$.subscribe(data => {
        this.msaapDisplayVolumeControls = !this.msaapDisplayVolumeControls;
        const reEnableVolumeControl = setTimeout(() => {
          this.msaapDisplayVolumeControls = true;
          console.log(this.msaapPlaylist);
          clearTimeout(reEnableVolumeControl);
        }, 0);
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
    } else {
      this.isLoggedIn = false;
    }
  }

}
