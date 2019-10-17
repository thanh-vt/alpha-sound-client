import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArtistComponent} from './artist/artist.component';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {ArtistUploadComponent} from './artist-upload/artist-upload.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {ArtistDeleteComponent} from './artist-delete/artist-delete.component';
import {ArtistDetailComponent} from './artist-detail/artist-detail.component';


const routes: Routes = [
  {
    path: '',
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
        path: 'upload',
        component: ArtistUploadComponent
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
