import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlbumListComponent} from './album-list/album-list.component';
import {UploadAlbumComponent} from './upload-album/upload-album.component';
import {EditAlbumComponent} from './edit-album/edit-album.component';
import {DeleteAlbumComponent} from './delete-album/delete-album.component';
import {AlbumComponent} from './album/album.component';


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
        path:  'upload',
        component:  UploadAlbumComponent
      },
      {
        path:  'edit',
        component:  EditAlbumComponent
      },
      {
        path:  'delete',
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
