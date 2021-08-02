import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Country } from '../../../model/country';
import { CountryService } from '../../../service/country.service';

@Component({
  selector: 'app-delete-country',
  templateUrl: './delete-country.component.html',
  styleUrls: ['./delete-country.component.scss']
})
export class DeleteCountryComponent implements OnInit, OnDestroy {
  deleted: boolean;
  @Input() country: Country;
  message: string;
  error: boolean;
  loading: boolean;
  @Output() deleteCountry = new EventEmitter();
  private subscription: Subscription = new Subscription();

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.deleted = false;
  }

  onSubmit() {
    this.subscription.add(
      this.countryService.deleteCountry(this.country.id).subscribe(
        () => {
          this.deleteCountry.emit();
          this.error = false;
          this.deleted = true;
          this.message = 'Country deleted successfully.';
        },
        error => {
          this.error = true;
          this.message = 'Failed to delete country. An error has occurred.';
          console.log(error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
