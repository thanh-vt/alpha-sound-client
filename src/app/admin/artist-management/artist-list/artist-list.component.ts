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
  private artistList: Artist[];
  private message: string;
  private subscription: Subscription = new Subscription();

  constructor(private artistService: ArtistService) {
  }

  ngOnInit() {
    // this.artistService.artistList().subscribe(
    //   result => {
    //     this.artistList = result.content;
    //   }, error => {
    //     this.message = 'Cannot retrieve artist list. Cause:' + error.message;
    //   }
    // );
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
