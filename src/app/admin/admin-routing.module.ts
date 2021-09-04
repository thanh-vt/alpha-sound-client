import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminContainerComponent } from './admin-container/admin-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminContainerComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'artist-management',
        loadChildren: () => import('./artist-management/artist-management.module').then(mod => mod.ArtistManagementModule)
      },
      {
        path: 'song-management',
        loadChildren: () => import('./song-management/song-management.module').then(mod => mod.SongManagementModule)
      },
      {
        path: 'country-management',
        loadChildren: () => import('./country-management/country-management.module').then(mod => mod.CountryManagementModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
