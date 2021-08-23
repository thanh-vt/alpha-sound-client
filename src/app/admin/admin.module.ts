import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminContainerComponent } from './admin-container/admin-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserModule } from '../user/user.module';
import { ArtistManagementModule } from './artist-management/artist-management.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { VgControlModule, VgDirectivesModule } from 'ngx-vengeance-lib';

@NgModule({
  declarations: [AdminContainerComponent, DashboardComponent, LoginComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ArtistManagementModule,
    UserModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    VgDirectivesModule,
    VgControlModule
  ],
  exports: [AdminContainerComponent, DashboardComponent, LoginComponent]
})
export class AdminModule {}
