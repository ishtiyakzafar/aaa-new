import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolloverDeliveryPage } from './rollover-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: RolloverDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolloverDeliveryPageRoutingModule {}
