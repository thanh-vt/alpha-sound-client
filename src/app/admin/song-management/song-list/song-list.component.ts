import {Component, OnInit} from '@angular/core';
import {Song} from '../../../model/song';
import {Subscription} from 'rxjs';
import {SongService} from '../../../services/song.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songList: Song[];
  subscription: Subscription = new Subscription();
  message: string;

  constructor(private songService: SongService, private route: ActivatedRoute, router: Router) {
  }

  ngOnInit() {
    this.subscription = this.songService.getSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;
        } else {
          this.songList = null;
        }
      }, error1 => {
        this.message = 'Cannot retrieve songlist. Cause: ' + error1.message;
      }
    );
  }

  deleteSong() {
    // this.subscription.unsubscribe();
    this.subscription = this.songService.getSongList().subscribe(
      result => {
        if (result != null) {
          this.songList = result.content;

        } else {
          this.songList = null;
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.message;
      }
    );
  }

}
