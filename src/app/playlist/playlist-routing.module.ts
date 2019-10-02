import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistListComponent} from './playlist-list/playlist-list.component';
import {DeletePlaylistComponent} from './delete-playlist/delete-playlist.component';
import {PlaylistDetailComponent} from './playlist-detail/playlist-detail.component';
import {AddToPlaylistComponent} from './add-to-playlist/add-to-playlist.component';


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
      {
        path: 'add-to-playlist/:songId',
        component: AddToPlaylistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
