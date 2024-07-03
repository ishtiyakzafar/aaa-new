import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { CodeInputModule } from 'angular-code-input';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false,
    }),
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
