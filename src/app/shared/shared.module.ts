import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [HeaderComponent, NavbarComponent, SidebarComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [HeaderComponent, NavbarComponent, SidebarComponent]
})
export class SharedModule { }
