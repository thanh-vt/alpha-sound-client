import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongListComponent} from './song-list/song-list.component';
import {AdminAuthGuard} from '../../guard/admin-auth.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    component: SongListComponent,
    pathMatch: 'full'
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
export class SongManagementRoutingModule {
}
