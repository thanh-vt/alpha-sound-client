import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../../service/search.service';
import {Song} from '../../model/song';
import {Artist} from '../../model/artist';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedTabId = 'simple';
  searchText: string;
  songList: Song[] = [];
  artistList: Artist[];
  numberOfSongs: number;
  numberOfArtists: number;

  @ViewChild('searchTab', {static: false}) searchTab: NgbTabset;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {
    this.searchText = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.searchText = params.name;
        this.searchService.getSearchResults(this.searchText).subscribe(
          result => {
            this.songList = result.songs;
            this.artistList = result.artists;
            this.numberOfSongs = this.songList.length;
            this.numberOfArtists = this.artistList.length;
            if (this.numberOfSongs === 0 && this.numberOfArtists > 0) {
              this.searchTab.select('artists');
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }

}
