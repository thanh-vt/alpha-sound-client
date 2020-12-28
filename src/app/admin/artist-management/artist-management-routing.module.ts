import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArtistComponent} from './artist/artist.component';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {ArtistDeleteComponent} from './artist-delete/artist-delete.component';
import {ArtistDetailComponent} from './artist-detail/artist-detail.component';
import {AdminAuthGuard} from '../../guard/admin-auth.guard';
import {CreateArtistComponent} from './create-artist/create-artist.component';


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
    component: ArtistComponent,
    children: [
      {
        path: 'list',
        component: ArtistListComponent
      },
      {
        path: 'update-profile',
        component: ArtistEditComponent
      },
      {
        path: 'delete',
        component: ArtistDeleteComponent
      },
      {
        path: 'detail',
        component: ArtistDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistManagementRoutingModule {
}
