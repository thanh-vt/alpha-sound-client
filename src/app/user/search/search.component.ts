import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../../service/search.service';
import {Song} from '../../model/song';
import {Artist} from '../../model/artist';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedTabId = 'simple';
  searchText: string;
  private songList: Song[] = [];
  private artistList: Artist[];
  private numberSong: number;
  private numberArtist: number;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {
    this.searchText = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit() {
    this.searchService.getSearchResults(this.searchText).subscribe(
      result => {
        this.songList = result.songs;
        this.artistList = result.artists;
        this.numberSong = this.songList.length;
        this.numberArtist = this.artistList.length;
        console.log(result.songs);
      },
      error => {
        console.log(error);
      }
    );
  }

}
