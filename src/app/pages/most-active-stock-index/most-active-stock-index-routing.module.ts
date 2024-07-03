import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostActiveStockIndexPage } from './most-active-stock-index.page';

const routes: Routes = [
  {
    path: '',
    component: MostActiveStockIndexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostActiveStockIndexPageRoutingModule {}
