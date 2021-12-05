import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './guard/admin-auth.guard';
import { UserAuthGuard } from './guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [UserAuthGuard],
    loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
  },
  {
    path: 'admin',
    canActivateChild: [AdminAuthGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
