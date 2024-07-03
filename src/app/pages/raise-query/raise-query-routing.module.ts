import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RaiseQueryComponent } from './raise-query.component';

const routes: Routes = [
  {
    path: '',
    component: RaiseQueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseQueryPageRoutingModule {}
