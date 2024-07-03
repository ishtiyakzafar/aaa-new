import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AumFdPage } from './aum-fd.page';

const routes: Routes = [
  {
    path: '',
    component: AumFdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AumFdPageRoutingModule {}
