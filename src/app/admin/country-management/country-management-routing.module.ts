import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAuthGuard} from '../../guard/admin-auth.guard';
import {CountryListComponent} from './country-list/country-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    component: CountryListComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    pathMatch: 'prefix',
    redirectTo: 'list',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryManagementRoutingModule { }
