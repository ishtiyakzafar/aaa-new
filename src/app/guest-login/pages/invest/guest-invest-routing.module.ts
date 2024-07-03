import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestTab3Page } from './guest-invest';

const routes: Routes = [
  {
    path: '',
    component: GuestTab3Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestTab3PageRoutingModule {}
