import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AumPmsPage } from './aum-pms.page';

const routes: Routes = [
  {
    path: '',
    component: AumPmsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AumPmsPageRoutingModule {}
