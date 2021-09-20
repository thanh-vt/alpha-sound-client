import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumManagementRoutingModule } from './album-management-routing.module';
import { AlbumListComponent } from './album-list/album-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AlbumListComponent],
  imports: [CommonModule, AlbumManagementRoutingModule, SharedModule]
})
export class AlbumManagementModule {}
