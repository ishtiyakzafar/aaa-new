import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnerCodePage } from './partner-code.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerCodePageRoutingModule {}
