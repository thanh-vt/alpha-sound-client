import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryListComponent } from './country-list/country-list.component';

const routes: Routes = [
  {
    path: '',
    component: CountryListComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryManagementRoutingModule {}
