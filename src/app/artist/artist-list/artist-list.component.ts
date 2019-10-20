import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Playlist} from '../../model/playlist';
import {PlaylistService} from '../../service/playlist.service';
import {Artist} from '../../model/artist';
import {ArtistService} from '../../service/artist.service';
import {SongService} from '../../service/song.service';
import {User} from '../../model/user';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {
  currentUser: User;
  message: string;
  loading: boolean;
  subscription: Subscription = new Subscription();
  artistList: Artist[] = [];
  constructor(private artistService: ArtistService, private songService: SongService,
              userService: UserService) {
    userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    // this.subscription.unsubscribe();
    this.loading = true;
    this.subscription.add(this.artistService.artistList().subscribe(
      result => {
        if (result != null) {
          this.artistList = result.content;
          this.artistList.forEach((value, index) => {
            this.artistList[index].isDisabled = false;
          });
        }
      }, error => {
        this.message = 'Cannot retrieve Playlist list. Cause: ' + error.message;
      }, () => {
        this.loading = false;
      }
    ));
  }

}
