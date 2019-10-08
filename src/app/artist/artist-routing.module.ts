import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArtistDetailComponent} from './artist-detail/artist-detail.component';
import {ArtistComponent} from './artist/artist.component';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {ArtistDeleteComponent} from './artist-delete/artist-delete.component';

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
        path: 'detail',
        component: ArtistDetailComponent
      },
      {
        path: 'edit',
        component: ArtistEditComponent
      },
      {
        path: 'delete',
        component: ArtistDeleteComponent
        }
     ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArtistRoutingModule {
}
