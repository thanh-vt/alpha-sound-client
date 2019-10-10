import { Component, OnInit } from '@angular/core';
import {Album} from '../../model/album';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../../service/song.service';
import {PlaylistService} from '../../service/playlist.service';
import {AddSongToPlaylistService} from '../../service/add-song-to-playlist.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  private album: Album;
  private message;
  private songList: any[];
  private playList: Playlist;
  private subscription: Subscription;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,
    private addSongToPlaylistService: AddSongToPlaylistService
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
    this.addSongToPlaylistService.emitChange(song);
  }
}
