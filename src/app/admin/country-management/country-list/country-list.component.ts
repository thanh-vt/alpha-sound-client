import { Component, OnInit } from '@angular/core';
import {Country} from '../../../model/country';
import {CountryService} from '../../../service/country.service';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private countryService: CountryService, private translate: TranslateService) { }

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

  deleteCountry(id: number, event) {
    event.stopPropagation();
    this.subscription = this.countryService.deleteCountry(id).subscribe(
      result => {
        if (result != null) {
          this.countryService = result.content;
        } else {
          this.countryService = null;
        }
      }, error => {
        this.message = 'Cannot retrieve artist list. Cause: ' + error.message;
      }
    );
  }
}
