import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AdminAuthGuard} from '../guards/admin-auth.guard';


const routes: Routes = [
  {
    path: 'admin',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '', component: AdminComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      // tslint:disable-next-line:max-line-length
      {
        path: 'user-management',
        canActivate: [AdminAuthGuard],
        canActivateChild: [AdminAuthGuard],
        loadChildren: () => import('./user-management/user-management.module').then(mod => mod.UserManagementModule)
      },
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
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
