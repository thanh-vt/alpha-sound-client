import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ArtistRoutingModule} from './artist-routing.module';
import {ArtistComponent} from './artist/artist.component';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {ArtistDetailComponent} from './artist-detail/artist-detail.component';
import {ArtistCreateComponent} from './artist-create/artist-create.component';
import {ArtistDeleteComponent} from './artist-delete/artist-delete.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';


@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [ArtistComponent, ArtistListComponent, ArtistDetailComponent, ArtistCreateComponent, ArtistDeleteComponent, ArtistEditComponent],
  imports: [
    CommonModule,
    ArtistRoutingModule
  ]
})
export class ArtistModule {
}
