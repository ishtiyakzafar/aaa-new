import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WireRequestsPage } from './wire-requests.page';

const routes: Routes = [
  {
    path: '',
    component: WireRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WireRequestsPageRoutingModule {}
