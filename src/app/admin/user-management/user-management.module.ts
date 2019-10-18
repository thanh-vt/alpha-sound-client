import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import {UserListComponent} from './user-list/user-list.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [UserManagementComponent, UserListComponent, UserDeleteComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    NgbPaginationModule,
    SharedModule
  ],
  exports: [UserManagementComponent, UserListComponent]
})
export class UserManagementModule { }
