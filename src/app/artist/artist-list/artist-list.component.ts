import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Playlist} from '../../models/playlist';
import {PlaylistService} from '../../services/playlist.service';
import {Artist} from '../../models/artist';
import {ArtistService} from '../../services/artist.service';
import {SongService} from '../../services/song.service';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit, OnDestroy {
  currentUser: User;
  message: string;
  loading: boolean;
  subscription: Subscription = new Subscription();
  artistList: Artist[] = [];
  constructor(private artistService: ArtistService) {}

  ngOnInit() {
    this.loading = true;
    this.subscription.add(this.artistService.artistList()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        result => {
          if (result != null) {
            this.artistList = result.content;
            this.artistList.forEach((value, index) => {
              this.artistList[index].isDisabled = false;
            });
          }
        }, error => {
          this.message = 'An error has occurred.';
          console.log(error.message);
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
