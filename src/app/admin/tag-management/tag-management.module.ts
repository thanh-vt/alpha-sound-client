import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagManagementRoutingModule } from './tag-management-routing.module';
import { TagListComponent } from './tag-list/tag-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TagListComponent],
  imports: [CommonModule, TagManagementRoutingModule, NgbPaginationModule, SharedModule, ReactiveFormsModule, TranslateModule]
})
export class TagManagementModule {}
