import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CircularsMenuComponent } from './circulars-menu.component';
const routes: Routes = [
    {
      path: '',
      component: CircularsMenuComponent
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class CircularsMenuComponentRoutingModule {}  