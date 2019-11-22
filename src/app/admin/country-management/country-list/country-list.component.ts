import { Component, OnInit } from '@angular/core';
import {Country} from '../../../models/country';
import {CountryService} from '../../../services/country.service';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  countryList: Country[];
  message: string;
  loading: boolean;
  pageNumber: number;
  subscription: Subscription = new Subscription();

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    this.countryList = [];
    this.pageNumber = 0;
    this.onScroll(this.pageNumber);
  }

  onScroll(page: number) {
    this.loading = true;
    this.subscription.add(this.countryService.getCountryList(page)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        next => {
          for (const country of next.content) {
            this.countryList.push(country);
          }
        }, error => {
          this.message = 'Failed to retrieve country list';
          console.log(error.message);
        }
      ));
  }
}
