import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./user/user.module').then(mod => mod.UserModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule) },
  { path: '**', redirectTo: '' }
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
