import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewLoginPageRoutingModule } from './new-login-routing.module';

import { NewLoginPage } from './new-login.page';
import { CodeInputModule } from 'angular-code-input';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // FormsModule,
    IonicModule,
    NewLoginPageRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false,
    }),
  ],
  declarations: [NewLoginPage]
})
export class NewLoginPageModule {}
