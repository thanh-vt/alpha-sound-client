import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagListComponent } from './tag-list/tag-list.component';

const routes: Routes = [
  {
    path: 'tag-management',
    component: TagListComponent
  },
  {
    path: '**',
    redirectTo: 'tag-management'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule {}
