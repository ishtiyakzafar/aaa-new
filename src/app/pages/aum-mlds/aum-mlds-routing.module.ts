import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AumMldsPage } from './aum-mlds.page';

const routes: Routes = [
  {
    path: '',
    component: AumMldsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AumMldsPageRoutingModule {}
