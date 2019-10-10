import { Component, OnInit } from '@angular/core';
import {Artist} from '../../model/artist';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {
  private artist: Artist;

  constructor() { }

  ngOnInit() {
  }

}
