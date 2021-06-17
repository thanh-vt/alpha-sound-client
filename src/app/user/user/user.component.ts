import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UserProfile} from '../../model/token-response';
import {Track} from 'ngx-audio-player';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {Setting} from '../../model/setting';
import {SettingService} from '../../service/setting.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  currentUser: UserProfile;
  @Input() setting: Setting;

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

  constructor(private router: Router, private authService: AuthService,
              private playingQueueService: PlayingQueueService,
              private elementRef: ElementRef, private settingService: SettingService) {
    this.authService.currentUser$.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
    this.playingQueueService.currentQueue.subscribe(
      currentQueue => {
        this.msaapPlaylist = currentQueue;
      }
    );
    this.playingQueueService.update.subscribe(
      () => {
        this.msaapDisplayVolumeControls = !this.msaapDisplayVolumeControls;
        const reEnableVolumeControl = setTimeout(() => {
          this.msaapDisplayVolumeControls = true;
          clearTimeout(reEnableVolumeControl);
        }, 10);
      }
    );
    this.settingService.setting$.subscribe(
      next => {
        console.log(next);
        if (next) {
          this.setting = next;
        }
        if (this.setting?.darkMode) {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
        } else {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
        }
      }
    );
  }

  ngOnInit() {
  }
}
