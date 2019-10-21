import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlbumListComponent} from './album-list/album-list.component';
import {UploadAlbumComponent} from './upload-album/upload-album.component';
import {EditAlbumComponent} from './edit-album/edit-album.component';
import {DeleteAlbumComponent} from './delete-album/delete-album.component';
import {AlbumComponent} from './album/album.component';
import {AlbumDetailComponent} from './album-detail/album-detail.component';
import {AuthGuard} from '../guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path:  '',
    component: AlbumComponent,
    children: [
      {
        path:  'list',
        component:  AlbumListComponent
      },
      {
        path:  'detail',
        component:  AlbumDetailComponent
      },
      {
        path:  'upload',
        canActivate: [AuthGuard],
        component:  UploadAlbumComponent
      },
      {
        path:  'edit',
        canActivate: [AuthGuard],
        component:  EditAlbumComponent
      },
      {
        path:  'delete',
        canActivate: [AuthGuard],
        component:  DeleteAlbumComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
