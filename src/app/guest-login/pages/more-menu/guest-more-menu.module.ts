import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuestMoreRevampPageRoutingModule } from './guest-more-menu-routing.module';
import { GuestMoreRevampPage } from './guest-more-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestMoreRevampPageRoutingModule
  ],
  declarations: [GuestMoreRevampPage]
})
export class GuestMoreRevampPageModule {}
