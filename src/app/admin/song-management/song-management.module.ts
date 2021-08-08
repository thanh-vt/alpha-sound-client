import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongManagementRoutingModule } from './song-management-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SongListComponent],
  imports: [CommonModule, SongManagementRoutingModule, SharedModule, NgbDropdownModule, ReactiveFormsModule, TranslateModule]
})
export class SongManagementModule {}
