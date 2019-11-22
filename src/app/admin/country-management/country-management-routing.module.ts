import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAuthGuard} from '../../guards/admin-auth.guard';
import {CountryManagementComponent} from './country-management/country-management.component';
import {CountryListComponent} from './country-list/country-list.component';
import {DeleteCountryComponent} from './delete-country/delete-country.component';
import {CreateCountryComponent} from './create-country/create-country.component';
import {EditCountryComponent} from './edit-country/edit-country.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CountryManagementComponent,
    children: [
      {
        path: 'list',
        component: CountryListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryManagementRoutingModule { }
