import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenreListComponent } from './genre-list/genre-list.component';

const routes: Routes = [
  {
    path: 'genre-management',
    component: GenreListComponent
  },
  {
    path: '**',
    redirectTo: 'genre-management'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenreManagementRoutingModule {}
