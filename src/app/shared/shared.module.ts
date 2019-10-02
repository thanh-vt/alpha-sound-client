import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [HeaderComponent, NavbarComponent, SidebarComponent, FooterComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [HeaderComponent, NavbarComponent, SidebarComponent, FooterComponent]
})
export class SharedModule { }
