import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumDiscountPage } from './premium-discount.page';

const routes: Routes = [
  {
    path: '',
    component: PremiumDiscountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumDiscountPageRoutingModule {}
