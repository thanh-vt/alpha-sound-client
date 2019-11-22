import {Component, OnDestroy, OnInit} from '@angular/core';
import {Playlist} from '../../models/playlist';
import {PlaylistService} from '../../services/playlist.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  loading = false;
  error = false;
  message: string;
  subscription: Subscription = new Subscription();
  playlistList: Playlist[] = [];
  constructor(private playlistService: PlaylistService, private fb: FormBuilder) { }

  ngOnInit() {
    this.refreshPlaylistList();
  }

  refreshPlaylistList() {
    this.loading = true;
    this.subscription.add(this.playlistService.getPlaylistList()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
      result => {
        if (result != null) {
          this.playlistList = result.content;
          this.playlistList.forEach((value, index) => {
            this.playlistList[index].isDisabled = false;
          });
        } else {
          this.playlistList = null;
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
