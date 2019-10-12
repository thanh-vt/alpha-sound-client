import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistManagementRoutingModule } from './artist-management-routing.module';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistComponent } from './artist/artist.component';


@NgModule({
  declarations: [ArtistListComponent , ArtistComponent],
  imports: [
    CommonModule,
    ArtistManagementRoutingModule
  ]
})
export class ArtistManagementModule { }
