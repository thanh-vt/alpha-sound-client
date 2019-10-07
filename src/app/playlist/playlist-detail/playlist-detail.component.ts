import {Component, OnInit} from '@angular/core';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';
import {AddSongToPlaylistService} from '../../service/add-song-to-playlist.service';
import {Song} from '../../model/song';
import {Playlist} from '../../model/playlist';
import {Observable, of, Subscription} from 'rxjs';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent {
  private songList: Song[] = [
    // tslint:disable-next-line:max-line-length
    { id: 1, name: 'Conor McGregor', artists: [], releaseDate: 1570060800000 , url: 'http://localhost:8080/climax-sound/api/song/download/20%20-%20Grand%20Escape%20-%20Ygaria_.mp3' },
];
constructor() { }

}








  // private message;
  // private songList: any[];
  // private playList: Playlist;
  // private subscription: Subscription;
  // constructor(
  //   private playlistService: PlaylistService,
  //   private songService: SongService,
  //   private route: ActivatedRoute,
  //   private addSongToPlaylistService: AddSongToPlaylistService
  // ) {
  // }
  //
  // ngOnInit() {
  //   const id = +this.route.snapshot.paramMap.get('id');
  //   this.subscription = this.playlistService.getPlayListDetail(id).subscribe(
  //     result => {
  //       if (result != null) {
  //         this.playList = result;
  //
  //         this.playList.isDisabled = false;
  //         this.songList = this.playList.songs;
  //
  //       }
  //       console.log(this.playList);
  //     }, error => {
  //       this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
  //     }
  //   );
  //
  // }
  // addToPlaylist(song) {
  //   song.isDisabled = true;
  //   this.addSongToPlaylistService.emitChange(song);
  // }
