import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewLoginPage } from './new-login.page';

const routes: Routes = [
  {
    path: '',
    component: NewLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLoginPageRoutingModule {}
