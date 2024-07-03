import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FamilyPortfolioComponent } from './family-portfolio.component';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: FamilyPortfolioComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [FamilyPortfolioComponent],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FamilyPortfolioModule {}
