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
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then(mod => mod.UserManagementModule)
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
        path: 'album-management',
        loadChildren: () => import('./album-management/album-management.module').then(mod => mod.AlbumManagementModule)
      },
      {
        path: 'country-management',
        loadChildren: () => import('./country-management/country-management.module').then(mod => mod.CountryManagementModule)
      },
      {
        path: 'tag-management',
        loadChildren: () => import('./tag-management/tag-management.module').then(mod => mod.TagManagementModule)
      },
      {
        path: 'genre-management',
        loadChildren: () => import('./genre-management/genre-management.module').then(mod => mod.GenreManagementModule)
      },
      {
        path: 'theme-management',
        loadChildren: () => import('./theme-management/theme-management.module').then(mod => mod.ThemeManagementModule)
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
