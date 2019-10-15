import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistRoutingModule } from './artist-routing.module';
import { ArtistComponent } from './artist/artist.component';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ArtistComponent, ArtistListComponent, ArtistDetailComponent],
  imports: [
    CommonModule,
    ArtistRoutingModule,
    ReactiveFormsModule
  ]
})
export class ArtistModule { }
