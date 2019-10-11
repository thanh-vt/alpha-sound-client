import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-song-to-playlist',
  templateUrl: './add-song-to-playlist.component.html',
  styleUrls: ['./add-song-to-playlist.component.scss']
})
export class AddSongToPlaylistComponent implements OnInit {

  @Input() title = 'abc';
  message: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }
}
