import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestRecentlyViewedClientListPage } from './guest-recently-viewed-client-list.page';

const routes: Routes = [
  {
    path: '',
    component: GuestRecentlyViewedClientListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRecentlyViewedClientListPageRoutingModule {}
