import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolToppersPage } from './vol-toppers.page';

const routes: Routes = [
  {
    path: '',
    component: VolToppersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VolToppersPageRoutingModule {}
