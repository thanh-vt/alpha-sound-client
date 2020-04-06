import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../../services/search.service';
import {Song} from '../../models/song';
import {Artist} from '../../models/artist';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedTabId = 'simple';
  searchText: string;
  songList: Song[] = [];
  artistList: Artist[] = [];
  numberOfSongs: number;
  numberOfArtists: number;

  @ViewChild('searchTab') searchTab: NgbTabset;

  constructor(private route: ActivatedRoute, private searchService: SearchService, public translate: TranslateService) {
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
