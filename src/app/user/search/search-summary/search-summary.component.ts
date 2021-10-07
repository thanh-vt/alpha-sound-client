import { Component, Input, OnInit } from '@angular/core';
import { SearchSummary } from '../../../model/search-summary';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.scss']
})
export class SearchSummaryComponent implements OnInit {
  @Input() searchText: string;
  @Input() searchSummary: SearchSummary;
  ngOnInit(): void {}
}
