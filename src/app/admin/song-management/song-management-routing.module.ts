import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';

const routes: Routes = [
  {
    path: '',
    component: SongListComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongManagementRoutingModule {}
