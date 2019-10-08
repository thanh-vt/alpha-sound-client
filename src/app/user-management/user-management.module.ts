import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import {UserListComponent} from './user-list/user-list.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [UserManagementComponent, UserListComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    NgbPaginationModule
  ],
  exports: [UserManagementComponent, UserListComponent]
})
export class UserManagementModule { }
