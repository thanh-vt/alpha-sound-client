import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistListComponent} from './playlist-list/playlist-list.component';
import {PlaylistDetailComponent} from './playlist-detail/playlist-detail.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path:  '',
    component: PlaylistComponent,
    children: [
      {
        path:  'list',
        component:  PlaylistListComponent
      },
      {
        path:  'detail/:id',
        component:  PlaylistDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
