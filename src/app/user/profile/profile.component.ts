import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ArtistService} from '../../service/artist.service';
import {SongService} from '../../service/song.service';
import {PlaylistService} from '../../service/playlist.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {UserProfileService} from '../../service/user-profile.service';
import {TranslateService} from '@ngx-translate/core';
import {UserProfile} from '../../model/token-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  message: string;
  loading: boolean;
  showEditForm = false;
  username: string;
  user: UserProfile;
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private artistService: ArtistService,
              private songService: SongService, private playlistService: PlaylistService,
              private playingQueueService: PlayingQueueService,
              private userService: UserProfileService, public translate: TranslateService) {
    this.authService.currentUser$.subscribe(
      next => {
        this.currentUser = next;
      }
    );
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('id');
    this.userService.getUserDetail(this.username).subscribe(
      next => {
        this.user = next;
      }, error => {
        this.message = 'Cannot retrieve user information.';
        console.log(error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
