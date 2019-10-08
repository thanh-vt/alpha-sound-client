import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from '../guard/auth.guard';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: '', component: UserComponent, children: [
      { path: 'home', component: HomeComponent, canActivate: []},
      { path: 'register', component: RegisterComponent},
      { path: 'user/edit/:id', component: EditComponent},
      { path: 'song', loadChildren: () => import('../song/song.module').then(mod => mod.SongModule)},
      { path: 'album', loadChildren: () => import('../album/album.module').then(mod => mod.AlbumModule)},
      { path: 'playlist', loadChildren: () => import('../playlist/playlist.module').then(mod => mod.PlaylistModule)}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
