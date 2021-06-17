import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {AdminAuthGuard} from '../../guard/admin-auth.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    component: ArtistListComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'prefix'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistManagementRoutingModule {
}
