import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistManagementRoutingModule } from './artist-management-routing.module';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CreateArtistComponent } from './create-artist/create-artist.component';
import { VgDirectivesModule, VgLayoutModule, VgUtilModule } from 'ngx-vengeance-lib';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [ArtistListComponent, ArtistEditComponent, ArtistDetailComponent, CreateArtistComponent],
  imports: [
    CommonModule,
    ArtistManagementRoutingModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SharedModule,
    VgUtilModule,
    InfiniteScrollModule,
    VgDirectivesModule,
    VgLayoutModule
  ]
  // providers: [{ provide: NgbDateAdapter, useClass: CustomNgbDateAdapter }]
})
export class ArtistManagementModule {}
