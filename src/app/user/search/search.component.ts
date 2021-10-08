import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchSummary } from '../../model/search-summary';
import { DataUtil } from '../../util/data-util';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedTabId = 'summary';
  searchSummary: SearchSummary = {
    song: DataUtil.initPagingInfo(),
    album: DataUtil.initPagingInfo(),
    artist: DataUtil.initPagingInfo()
  };
  searchText = '';

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(next => {
      if (next.q) {
        this.searchText = next.q;
        this.searchService.search(this.searchText).subscribe(next => {
          this.searchSummary = next;
        });
      }
    });
  }

  changeTab(): void {
    console.log('scroll init');
    setTimeout(() => {
      console.log('scroll');
      DataUtil.scrollToTop();
    }, 500);
  }
}
