import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SipNewPage } from './sip-new.page';

const routes: Routes = [
  {
    path: '',
    component: SipNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SipNewPageRoutingModule {}
