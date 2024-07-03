import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutGainerLoserPage } from './fut-gainer-loser.page';

const routes: Routes = [
  {
    path: '',
    component: FutGainerLoserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FutGainerLoserPageRoutingModule {}
