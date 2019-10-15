import { Component, OnInit } from '@angular/core';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';

import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {Song} from '../../model/song';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';


@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})

export class SongDetailComponent implements OnInit {
  private song: Song;
  private message;
  private songList: any[];
  private playList: Playlist;
  private subscription: Subscription;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private addSongToPlaying: AddSongToPlaying
  ) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.subscription = this.playlistService.getPlayListDetail(id).subscribe(
      result => {
        if (result != null) {
          this.playList = result;

          this.playList.isDisabled = false;
          this.songList = this.playList.songs;

        }
        console.log(this.playList);
      }, error => {
        this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
      }
    );
  }
  addToPlaylist(song) {
    song.isDisabled = true;
    this.addSongToPlaying.emitChange(song);
  }

}
