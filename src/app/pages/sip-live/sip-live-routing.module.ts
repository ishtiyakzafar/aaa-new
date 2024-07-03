import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SipLivePage } from './sip-live.page';

const routes: Routes = [
  {
    path: '',
    component: SipLivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SipLivePageRoutingModule {}
