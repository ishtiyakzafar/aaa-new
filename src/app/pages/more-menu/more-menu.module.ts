import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoreRevampPageRoutingModule } from './more-menu-routing.module';
import { MoreRevampPage } from './more-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreRevampPageRoutingModule
  ],
  declarations: [MoreRevampPage]
})
export class MoreRevampPageModule {}
