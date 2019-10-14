import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AdminAuthGuard} from '../guard/admin-auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '', component: AdminComponent, children: [
      { path: 'login', component: LoginComponent},
      { path: 'dashboard', component: DashboardComponent},
      // tslint:disable-next-line:max-line-length
      { path: 'user-management', canActivate: [AdminAuthGuard], loadChildren: () => import('../user-management/user-management.module').then(mod => mod.UserManagementModule)}
    ]}
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
