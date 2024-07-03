import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDetailsPageRoutingModule } from './company-details-routing.module';

import { CompanyDetailsPage } from './company-details.page';
import { NumberFormatPipe } from '../../components/pipes.module';
import { SharedModule } from '../../components/shared.module';
// import { NumberformatPipe } from '../../helpers/numberformat.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyDetailsPageRoutingModule,
    NumberFormatPipe,
    SharedModule
  ],
  declarations: [CompanyDetailsPage],
  

})
export class CompanyDetailsPageModule {}
