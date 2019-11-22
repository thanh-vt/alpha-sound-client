import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SongListComponent} from './song-list/song-list.component';
import {SongDeleteComponent} from './song-delete/song-delete.component';
import {AdminAuthGuard} from '../../guards/admin-auth.guard';
import {SongManagementComponent} from './song-management/song-management.component';


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
    component: SongManagementComponent,
    children: [
      {
        path: 'list',
        component: SongListComponent
      },
      {
        path: 'delete',
        component: SongDeleteComponent
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
