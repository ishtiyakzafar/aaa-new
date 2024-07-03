import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddScriptPage } from './add-script.page';

const routes: Routes = [
  {
    path: '',
    component: AddScriptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddScriptPageRoutingModule {}
