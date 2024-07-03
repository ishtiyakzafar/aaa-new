import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniqueClientsPage } from './unique-clients.page';

const routes: Routes = [
  {
    path: '',
    component: UniqueClientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniqueClientsPageRoutingModule {}
