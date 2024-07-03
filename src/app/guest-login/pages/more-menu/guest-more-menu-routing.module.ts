import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestMoreRevampPage } from './guest-more-menu.page';

const routes: Routes = [
  {
    path: '',
    component: GuestMoreRevampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestMoreRevampPageRoutingModule {}
