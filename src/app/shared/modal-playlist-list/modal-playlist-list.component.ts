import {Component, Input, OnInit} from '@angular/core';
import {Playlist} from '../../model/playlist';
import {PlaylistService} from '../../service/playlist.service';

@Component({
  selector: 'app-modal-playlist-list',
  templateUrl: './modal-playlist-list.component.html',
  styleUrls: ['./modal-playlist-list.component.scss']
})
export class ModalPlaylistListComponent implements OnInit {

  @Input() title: string;
  @Input() songId: number;
  @Input() playlistList: Playlist[] = [];
  message: string;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.playlistService.getPlaylistListToAdd(this.songId).subscribe(
      result => {
        this.playlistList = result;
      },
      error1 => {
        this.message = 'Cannot retrieve playlist. Cause ' + error1.message;
      }
    );
  }

}
