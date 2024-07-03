import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCustomMappingPage } from './manage-custom-mapping';

const routes: Routes = [
  {
    path: '',
    component: ManageCustomMappingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCustomMappingPageRoutingModule {}
