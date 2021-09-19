import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeManagementRoutingModule } from './theme-management-routing.module';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VgControlModule } from 'ngx-vengeance-lib';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ThemeListComponent],
  imports: [
    CommonModule,
    ThemeManagementRoutingModule,
    NgbPaginationModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    VgControlModule
  ]
})
export class ThemeManagementModule {}
