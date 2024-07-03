import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreRevampPage } from './more-menu.page';

const routes: Routes = [
  {
    path: '',
    component: MoreRevampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreRevampPageRoutingModule {}
