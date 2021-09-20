import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';

const routes: Routes = [
  {
    path: '',
    component: AlbumListComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumManagementRoutingModule {}
