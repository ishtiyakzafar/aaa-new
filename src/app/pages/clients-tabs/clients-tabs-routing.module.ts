import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientTabsPage } from './clients-tabs';

const routes: Routes = [
  {
    path: '',
    component: ClientTabsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class clientTabsPageRoutingModule {}
