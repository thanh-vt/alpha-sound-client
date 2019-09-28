import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistListComponent} from './playlist-list/playlist-list.component';
import {CreatePlaylistComponent} from './create-playlist/create-playlist.component';
import {EditPlaylistComponent} from './edit-playlist/edit-playlist.component';
import {DeletePlaylistComponent} from './delete-playlist/delete-playlist.component';


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
        path:  'create',
        component:  CreatePlaylistComponent
      },
      {
        path:  'edit',
        component:  EditPlaylistComponent
      },
      {
        path:  'delete',
        component:  DeletePlaylistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
