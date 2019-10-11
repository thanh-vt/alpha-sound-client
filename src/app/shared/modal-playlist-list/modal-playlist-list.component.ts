import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-modal-playlist-list',
  templateUrl: './modal-playlist-list.component.html',
  styleUrls: ['./modal-playlist-list.component.scss']
})
export class ModalPlaylistListComponent implements OnInit {

  @Input() title: string;
  @Input() songId: number;

  constructor() { }

  ngOnInit() {
  }

}
