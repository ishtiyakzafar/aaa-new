import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';


import { GuestLoginPage } from './guest-login.page';
import { CodeInputModule } from 'angular-code-input';
import { SharedModule } from '../../../components/shared.module';
const routes: Routes = [
  {
    path: '',
    component: GuestLoginPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    // FormsModule,
    IonicModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false,
    }),
  ],
  declarations: [GuestLoginPage],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class GuestLoginPageModule {}
