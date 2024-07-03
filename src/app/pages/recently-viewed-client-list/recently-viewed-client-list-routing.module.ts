import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentlyViewedClientListPage } from './recently-viewed-client-list.page';

const routes: Routes = [
  {
    path: '',
    component: RecentlyViewedClientListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentlyViewedClientListPageRoutingModule {}
