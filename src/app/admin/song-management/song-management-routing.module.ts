import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SongComponent} from './song/song.component';
import {SongListComponent} from './song-list/song-list.component';
import {SongDeleteComponent} from './song-delete/song-delete.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SongComponent,
    children: [
      {
        path: 'list',
        component: SongListComponent
      },
      {
        path: 'delete',
        component: SongDeleteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongManagementRoutingModule { }
