import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ArtistManagementRoutingModule} from './artist-management-routing.module';
import {ArtistListComponent} from './artist-list/artist-list.component';
import {ArtistComponent} from './artist/artist.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {ArtistDeleteComponent} from './artist-delete/artist-delete.component';
import {ArtistDetailComponent} from './artist-detail/artist-detail.component';
import {ArtistUploadComponent} from './artist-upload/artist-upload.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import { CreateArtistComponent } from './create-artist/create-artist.component';


@NgModule({
  declarations: [ArtistListComponent, ArtistComponent,
    ArtistEditComponent, ArtistDeleteComponent, ArtistDetailComponent, ArtistUploadComponent, CreateArtistComponent],
  imports: [
    CommonModule,
    ArtistManagementRoutingModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class ArtistManagementModule {
}
