import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import {UserModule} from '../user/user.module';

@NgModule({
  declarations: [AdminComponent, DashboardComponent, LoginComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UserModule
  ],
  exports: [AdminComponent, DashboardComponent, LoginComponent]
})
export class AdminModule { }
