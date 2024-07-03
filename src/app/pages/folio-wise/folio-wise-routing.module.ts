import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FolioWisePage } from './folio-wise.page';


const routes: Routes = [
  {
    path: '',
    component: FolioWisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolioWisePageRoutingModule { }
