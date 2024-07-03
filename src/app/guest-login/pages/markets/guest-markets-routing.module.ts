import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestMarketsPage } from './guest-markets.page';

const routes: Routes = [
  {
    path: '',
    component: GuestMarketsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestMarketsPageRoutingModule {}
