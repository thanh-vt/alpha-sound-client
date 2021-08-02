import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminContainerComponent } from './admin-container/admin-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAuthGuard } from '../guard/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminContainerComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      // eslint-disable-next-line max-len
      {
        path: 'artist-management',
        canActivate: [AdminAuthGuard],
        canActivateChild: [AdminAuthGuard],
        loadChildren: () => import('./artist-management/artist-management.module').then(mod => mod.ArtistManagementModule)
      },
      {
        path: 'song-management',
        canActivate: [AdminAuthGuard],
        canActivateChild: [AdminAuthGuard],
        loadChildren: () => import('./song-management/song-management.module').then(mod => mod.SongManagementModule)
      },
      {
        path: 'country-management',
        canActivate: [AdminAuthGuard],
        canActivateChild: [AdminAuthGuard],
        loadChildren: () => import('./country-management/country-management.module').then(mod => mod.CountryManagementModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
