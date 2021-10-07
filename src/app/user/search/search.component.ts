import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchSummary } from '../../model/search-summary';
import { UserProfileService } from '../../service/user-profile.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedTabId = 'summary';
  searchSummary: SearchSummary;
  searchText = '';
  constructor(private activatedRoute: ActivatedRoute, private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(next => {
      if (next.q) {
        this.searchText = next.q;
        this.userProfileService.search(this.searchText).subscribe(next => {
          this.searchSummary = next;
        });
      }
    });
  }
}
