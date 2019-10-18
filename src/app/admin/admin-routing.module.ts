import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../guard/auth.guard';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ArtistListComponent} from './artist-management/artist-list/artist-list.component';
import {ArtistComponent} from './artist-management/artist/artist.component';


const routes: Routes = [
  {
    path: 'ad',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  // {path: 'login', component: LoginComponent},
  {
    path: '', component: AdminComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      // tslint:disable-next-line:max-line-length
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then(mod => mod.UserManagementModule)
      },
      {
        path: 'artist',
        loadChildren: () => import('./artist-management/artist-management.module').then(mod => mod.ArtistManagementModule)
      },
      {
        path: 'song',
        loadChildren: () => import('./song-management/song-management.module').then(mod => mod.SongManagementModule)
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
