import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryManagementRoutingModule } from './country-management-routing.module';
import { CountryManagementComponent } from './country-management/country-management.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CreateCountryComponent } from './create-country/create-country.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { DeleteCountryComponent } from './delete-country/delete-country.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [CountryManagementComponent, CountryListComponent, CreateCountryComponent, EditCountryComponent, DeleteCountryComponent],
  imports: [
    CommonModule,
    CountryManagementRoutingModule,
    InfiniteScrollModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CountryManagementModule { }
