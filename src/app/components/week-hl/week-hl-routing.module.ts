import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeekHlPage } from './week-hl.page';

const routes: Routes = [
  {
    path: '',
    component: WeekHlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeekHlPageRoutingModule {}
