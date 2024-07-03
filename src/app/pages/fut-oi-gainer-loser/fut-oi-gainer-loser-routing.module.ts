import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutOiGainerLoserPage } from './fut-oi-gainer-loser.page';

const routes: Routes = [
  {
    path: '',
    component: FutOiGainerLoserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FutOiGainerLoserPageRoutingModule {}
