import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from '../guards/auth.guard';
import {SearchComponent} from './search/search.component';
import {UploadedSongListComponent} from './uploaded-song-list/uploaded-song-list.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {ProfileComponent} from './profile/profile.component';
import {CompleteRegistrationComponent} from './complete-registration/complete-registration.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: '', component: UserComponent, children: [
      { path: 'home', component: HomeComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'complete-registration', component: CompleteRegistrationComponent},
      { path: 'profile/:id', component: ProfileComponent},
      { path: 'song', loadChildren: () => import('../song/song.module').then(mod => mod.SongModule)},
      { path: 'album', loadChildren: () => import('../album/album.module').then(mod => mod.AlbumModule)},
      // tslint:disable-next-line:max-line-length
      { path: 'playlist', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: () => import('../playlist/playlist.module').then(mod => mod.PlaylistModule)},
      { path: 'artist', loadChildren: () => import('../artist/artist.module').then(mod => mod.ArtistModule)},
      { path: 'search', component: SearchComponent},
      { path: 'uploaded', canActivate: [AuthGuard], component: UploadedSongListComponent},
      { path: 'favorites', canActivate: [AuthGuard], component: FavoritesComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
