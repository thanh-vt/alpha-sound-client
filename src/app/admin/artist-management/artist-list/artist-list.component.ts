import {Component, OnInit} from '@angular/core';
import {ArtistService} from '../../../service/artist.service';
import {Artist} from '../../../model/artist';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {
  artistList: Artist[];
  message: string;
  subscription: Subscription = new Subscription();
  loading: boolean;

  constructor(private artistService: ArtistService) {
  }

  ngOnInit() {
    this.subscription = this.artistService.artistList().subscribe(
      result => {
        if (result != null) {
          this.artistList = result.content;

        } else {
          this.artistList = null;
        }
      }, error => {
        this.message = 'Cannot retrieve artist list. Cause: ' + error.message;
      }
    );
  }

  deleteArtist() {
    // this.subscription.unsubscribe();
    this.subscription = this.artistService.artistList().subscribe(
      result => {
        if (result != null) {
          this.artistList = result.content;

        } else {
          this.artistList = null;
        }
      }, error => {
        this.message = 'Cannot retrieve artist list. Cause: ' + error.message;
      }
    );
  }


}
