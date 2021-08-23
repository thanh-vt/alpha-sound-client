import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserProfile } from '../../model/token-response';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Setting } from '../../model/setting';
import { SettingService } from '../../service/setting.service';
import { PlayingQueueService } from 'src/app/shared/layout/music-player/playing-queue.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  currentUser: UserProfile;
  @Input() setting: Setting;

  constructor(
    private router: Router,
    private authService: AuthService,
    private playingQueueService: PlayingQueueService,
    private elementRef: ElementRef,
    private settingService: SettingService
  ) {
    this.authService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    // this.playingQueueService.currentQueue.subscribe(currentQueue => {
    //   this.msaapPlaylist = currentQueue;
    // });
    // this.playingQueueService.addAllToQueueAndPlay([
    //   {
    //     name: "All This Is - Joe L.'s Studio",
    //     duration: '2:46',
    //     file: 'JLS_ATI'
    //   },
    //   {
    //     name: 'The Forsaken - Broadwing Studio (Final Mix)',
    //     duration: '8:30',
    //     file: 'BS_TF'
    //   },
    //   {
    //     name: "All The King's Men - Broadwing Studio (Final Mix)",
    //     duration: '5:01',
    //     file: 'BS_ATKM'
    //   },
    //   {
    //     name: 'The Forsaken - Broadwing Studio (First Mix)',
    //     duration: '8:31',
    //     file: 'BSFM_TF'
    //   },
    //   {
    //     name: "All The King's Men - Broadwing Studio (First Mix)",
    //     duration: '5:05',
    //     file: 'BSFM_ATKM'
    //   },
    //   {
    //     name: 'All This Is - Alternate Cuts',
    //     duration: '2:48',
    //     file: 'AC_ATI'
    //   },
    //   {
    //     name: "All The King's Men (Take 1) - Alternate Cuts",
    //     duration: '5:44',
    //     file: 'AC_ATKMTake_1'
    //   },
    //   {
    //     name: "All The King's Men (Take 2) - Alternate Cuts",
    //     duration: '5:26',
    //     file: 'AC_ATKMTake_2'
    //   },
    //   {
    //     name: 'Magus - Alternate Cuts',
    //     duration: '5:46',
    //     file: 'AC_M'
    //   },
    //   {
    //     name: 'The State Of Wearing Address (fucked up) - Alternate Cuts',
    //     duration: '5:25',
    //     file: 'AC_TSOWAfucked_up'
    //   },
    //   {
    //     name: "Magus - Popeye's (New Years '04 - '05)",
    //     duration: '5:53',
    //     file: 'PNY04-05_M'
    //   },
    //   {
    //     name: "On The Waterfront - Popeye's (New Years '04 - '05)",
    //     duration: '4:40',
    //     file: 'PNY04-05_OTW'
    //   },
    //   {
    //     name: "Trance - Popeye's (New Years '04 - '05)",
    //     duration: '13:15',
    //     file: 'PNY04-05_T'
    //   },
    //   {
    //     name: "The Forsaken - Popeye's (New Years '04 - '05)",
    //     duration: '8:12',
    //     file: 'PNY04-05_TF'
    //   },
    //   {
    //     name: "The State Of Wearing Address - Popeye's (New Years '04 - '05)",
    //     duration: '7:02',
    //     file: 'PNY04-05_TSOWA'
    //   },
    //   {
    //     name: "Magus - Popeye's (Valentine's Day '05)",
    //     duration: '5:43',
    //     file: 'PVD_M'
    //   },
    //   {
    //     name: "Trance - Popeye's (Valentine's Day '05)",
    //     duration: '10:45',
    //     file: 'PVD_T'
    //   },
    //   {
    //     name: "The State Of Wearing Address - Popeye's (Valentine's Day '05)",
    //     duration: '5:36',
    //     file: 'PVD_TSOWA'
    //   },
    //   {
    //     name: 'All This Is - Smith St. Basement (01/08/04)',
    //     duration: '2:48',
    //     file: 'SSB01_08_04_ATI'
    //   },
    //   {
    //     name: 'Magus - Smith St. Basement (01/08/04)',
    //     duration: '5:46',
    //     file: 'SSB01_08_04_M'
    //   },
    //   {
    //     name: 'Beneath The Painted Eye - Smith St. Basement (06/06/03)',
    //     duration: '13:07',
    //     file: 'SSB06_06_03_BTPE'
    //   },
    //   {
    //     name: 'Innocence - Smith St. Basement (06/06/03)',
    //     duration: '5:16',
    //     file: 'SSB06_06_03_I'
    //   },
    //   {
    //     name: 'Magus - Smith St. Basement (06/06/03)',
    //     duration: '5:46',
    //     file: 'SSB06_06_03_M'
    //   },
    //   {
    //     name: 'Madness Explored - Smith St. Basement (06/06/03)',
    //     duration: '4:51',
    //     file: 'SSB06_06_03_ME'
    //   },
    //   {
    //     name: 'The Forsaken - Smith St. Basement (06/06/03)',
    //     duration: '8:43',
    //     file: 'SSB06_06_03_TF'
    //   },
    //   {
    //     name: 'All This Is - Smith St. Basement (12/28/03)',
    //     duration: '3:00',
    //     file: 'SSB12_28_03_ATI'
    //   },
    //   {
    //     name: 'Magus - Smith St. Basement (12/28/03)',
    //     duration: '6:09',
    //     file: 'SSB12_28_03_M'
    //   },
    //   {
    //     name: 'Madness Explored - Smith St. Basement (12/28/03)',
    //     duration: '5:05',
    //     file: 'SSB12_28_03_ME'
    //   },
    //   {
    //     name: 'Trance - Smith St. Basement (12/28/03)',
    //     duration: '12:32',
    //     file: 'SSB12_28_03_T'
    //   },
    //   {
    //     name: 'The Forsaken - Smith St. Basement (12/28/03)',
    //     duration: '8:56',
    //     file: 'SSB12_28_03_TF'
    //   },
    //   {
    //     name: "All This Is (Take 1) - Smith St. Basement (Nov. '03)",
    //     duration: '4:55',
    //     file: 'SSB___11_03_ATITake_1'
    //   },
    //   {
    //     name: "All This Is (Take 2) - Smith St. Basement (Nov. '03)",
    //     duration: '5:45',
    //     file: 'SSB___11_03_ATITake_2'
    //   },
    //   {
    //     name: "Beneath The Painted Eye (Take 1) - Smith St. Basement (Nov. '03)",
    //     duration: '14:05',
    //     file: 'SSB___11_03_BTPETake_1'
    //   },
    //   {
    //     name: "Beneath The Painted Eye (Take 2) - Smith St. Basement (Nov. '03)",
    //     duration: '13:25',
    //     file: 'SSB___11_03_BTPETake_2'
    //   },
    //   {
    //     name: "The Forsaken (Take 1) - Smith St. Basement (Nov. '03)",
    //     duration: '8:37',
    //     file: 'SSB___11_03_TFTake_1'
    //   },
    //   {
    //     name: "The Forsaken (Take 2) - Smith St. Basement (Nov. '03)",
    //     duration: '8:36',
    //     file: 'SSB___11_03_TFTake_2'
    //   }
    // ]);
    this.settingService.setting$.subscribe(next => {
      if (next) {
        this.setting = next;
      }
      if (this.setting?.darkMode) {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
      } else {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
      }
    });
  }

  ngOnInit() {}
}
