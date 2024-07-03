import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HelpSupportPageRoutingModule } from './help-support-routing.module';
import { HelpSupportComponent } from './help-support.component';
import { SharedModule } from '../../components/shared.module';
import { LoginService } from '../login/login.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    HelpSupportPageRoutingModule 
  ],
  declarations: [HelpSupportComponent],
  providers:[LoginService]
})
export class HelpSupportPageModule {}