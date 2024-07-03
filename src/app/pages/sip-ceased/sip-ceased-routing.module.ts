import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SipCeasedPage } from './sip-ceased.page';

const routes: Routes = [
  {
    path: '',
    component: SipCeasedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SipCeasedPageRoutingModule {}
