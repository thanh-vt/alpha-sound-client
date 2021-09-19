import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenreManagementRoutingModule } from './genre-management-routing.module';
import { GenreListComponent } from './genre-list/genre-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [GenreListComponent],
  imports: [CommonModule, GenreManagementRoutingModule, NgbPaginationModule, SharedModule, ReactiveFormsModule, TranslateModule]
})
export class GenreManagementModule {}
