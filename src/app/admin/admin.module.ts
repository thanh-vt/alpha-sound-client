import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import {UserModule} from '../user/user.module';
import {ArtistComponent} from './artist-management/artist/artist.component';
import {ArtistManagementModule} from './artist-management/artist-management.module';

@NgModule({
  declarations: [AdminComponent, DashboardComponent, LoginComponent, ArtistComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ArtistManagementModule,
    UserModule
  ],
  exports: [AdminComponent, DashboardComponent, LoginComponent, ArtistComponent]
})
export class AdminModule { }
