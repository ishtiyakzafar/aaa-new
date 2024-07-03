import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SipBouncedPage } from './sip-bounced.page';

const routes: Routes = [
  {
    path: '',
    component: SipBouncedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SipBouncedPageRoutingModule {}
