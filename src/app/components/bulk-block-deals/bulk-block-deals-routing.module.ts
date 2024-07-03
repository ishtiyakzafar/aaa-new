import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkBlockDealsPage } from './bulk-block-deals.page';

const routes: Routes = [
  {
    path: '',
    component: BulkBlockDealsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkBlockDealsPageRoutingModule {}
