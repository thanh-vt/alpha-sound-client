import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import {UserModule} from '../user/user.module';
import {ArtistComponent} from './artist-management/artist/artist.component';
import {ArtistManagementModule} from './artist-management/artist-management.module';
import {UserManagementModule} from '../user-management/user-management.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {NgbButtonsModule, NgbPaginationModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AdminComponent, DashboardComponent, LoginComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ArtistManagementModule,
    UserModule,
    UserManagementModule,
    ReactiveFormsModule,
    SharedModule,
    NgbPaginationModule,
    NgbTabsetModule,
    FormsModule,
    NgbButtonsModule
  ],
  exports: [AdminComponent, DashboardComponent, LoginComponent]
})
export class AdminModule { }
