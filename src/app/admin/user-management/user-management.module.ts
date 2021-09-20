import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, UserManagementRoutingModule, SharedModule]
})
export class UserManagementModule {}
