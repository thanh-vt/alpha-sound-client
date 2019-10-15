import { Component, OnInit } from '@angular/core';
import {Album} from '../../model/album';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';

@Component({
  selector: 'app-delete-album',
  templateUrl: './delete-album.component.html',
  styleUrls: ['./delete-album.component.scss']
})
export class DeleteAlbumComponent implements OnInit {

  private album: Album;
  private message;
  private songList: any[];
  private playList: Playlist;
  private subscription: Subscription;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private route: ActivatedRoute,

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



}
