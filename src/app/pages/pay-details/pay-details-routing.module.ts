import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayDetailsPage } from './pay-details.page';

const routes: Routes = [
  {
    path: '',
    component: PayDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayDetailsPageRoutingModule {}
