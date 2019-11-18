import {Component, OnInit} from '@angular/core';
import {ArtistService} from '../../../services/artist.service';
import {Artist} from '../../../model/artist';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private artistService: ArtistService, public translate: TranslateService) {
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

  deleteArtist(event) {
    event.stopPropagation();
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
