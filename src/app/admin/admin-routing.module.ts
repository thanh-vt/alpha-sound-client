import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard';
import {LoginComponent} from '../admin/login/login.component';
import {AdminComponent} from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';


const routes: Routes = [
  // {
  //   path: 'ad',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
  { path: 'login', component: LoginComponent},
  { path: '', component: AdminComponent, canActivateChild: [], children: [
      { path: 'dashboard', component: DashboardComponent},
      // tslint:disable-next-line:max-line-length
      { path: 'user-management', loadChildren: () => import('../user-management/user-management.module').then(mod => mod.UserManagementModule)}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
