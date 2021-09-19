import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemeListComponent } from './theme-list/theme-list.component';

const routes: Routes = [
  {
    path: 'theme-management',
    component: ThemeListComponent
  },
  {
    path: '**',
    redirectTo: 'theme-management'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeManagementRoutingModule {}
