import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryManagementRoutingModule } from './country-management-routing.module';
import { CountryListComponent } from './country-list/country-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CountryListComponent],
  imports: [CommonModule, CountryManagementRoutingModule, InfiniteScrollModule, SharedModule, ReactiveFormsModule]
})
export class CountryManagementModule {}
